"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Send, Paperclip, Loader2, MessageSquare } from "lucide-react";
import { useGetChats } from "@/lib/hooks/queries/useChat";
import { useInitiateChat, useSendMessage } from "@/lib/hooks/mutations/ChatMutations";
import { fetchMessages, sendMessage as sendMessageApi } from "@/lib/hooks/api/ChatApi";
import { getSocket, disconnectSocket, SOCKET_EVENTS } from "@/lib/socket";
import { useAuthMe } from "@/lib/hooks/queries/useQueries";
import PageLoader from "@/components/common/PageLoader";
import { ErrorToast } from "@/components/ui/toaster";
import moment from "moment";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (participant) => {
  if (!participant) return "??";
  const details = participant.details || participant;
  const first = details?.firstName || details?.fullName?.split(" ")[0] || "";
  const last = details?.lastName || details?.fullName?.split(" ")[1] || "";
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "??";
};

const getDisplayName = (participant) => {
  if (!participant) return "Manager";
  const details = participant.details || participant;
  if (details?.fullName) return details.fullName;
  if (details?.firstName || details?.lastName)
    return `${details.firstName || ""} ${details.lastName || ""}`.trim();
  return "Manager";
};

const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentDate = null;

  // Filter out any duplicate messages by string _id
  const uniqueMessages = [];
  const seenIds = new Set();
  for (const msg of messages) {
    const idStr = msg._id?.toString();
    if (idStr && seenIds.has(idStr)) continue;
    if (idStr) seenIds.add(idStr);
    uniqueMessages.push(msg);
  }

  [...uniqueMessages].reverse().forEach((msg, idx) => {
    const date = moment(msg.createdAt).startOf("day").valueOf();
    if (date !== currentDate) {
      currentDate = date;
      groups.push({ type: "date", date: msg.createdAt, id: `date-${date}-${idx}` });
    }
    groups.push({ type: "message", ...msg });
  });
  return groups;
};

const formatDate = (dateStr) => {
  const d = moment(dateStr);
  if (d.isSame(moment(), "day")) return "Today";
  if (d.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";
  return d.format("MMM D, YYYY");
};

const formatTime = (dateStr) => moment(dateStr).format("hh:mm A");

// ─── Sub-components ───────────────────────────────────────────────────────────

const Avatar = ({ participant, size = "md", className = "" }) => {
  const initials = getInitials(participant);
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-11 h-11 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-[#010067] to-[#0c0c5e] flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
};

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
      <MessageSquare className="w-9 h-9 text-gray-300" />
    </div>
    <div className="text-center">
      <p className="font-semibold text-gray-500 text-base">No messages yet</p>
      <p className="text-sm mt-1">Start the conversation with your manager</p>
    </div>
  </div>
);

// ─── Main ChatUI ──────────────────────────────────────────────────────────────

export default function ChatUI() {
  const { data: me } = useAuthMe();
  const { data: chats = [], isLoading: chatsLoading } = useGetChats();

  const initiateChatMutation = useInitiateChat();

  // The bartender has at most one chat (with their lounge manager)
  const activeChat = chats?.[0] || null;
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const myId = me?._id?.toString();

  // ── Step 1: Initiate chat on mount if bartender has a loungeId ──────────────
  useEffect(() => {
    if (!me) return;
    // If chats already loaded and there's one, use it directly
    if (activeChat) {
      setChatId(activeChat._id);
      return;
    }
    // If no chat exists and we know bartender's loungeId, initiate
    if (!chatsLoading && chats.length === 0 && me?.loungeId) {
      initiateChatMutation.mutate(
        { loungeId: me.loungeId },
        {
          onSuccess: (chat) => {
            if (chat?._id) setChatId(chat._id);
          },
          onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Failed to start chat");
          },
        }
      );
    }
  }, [me, chats, chatsLoading]);

  // ── Step 2: When chatId resolves, load history ──────────────────────────────
  useEffect(() => {
    if (!chatId) return;
    setMessagesLoading(true);
    fetchMessages({ chatId, page: 1, limit: 30 })
      .then(({ messages: msgs, pagination }) => {
        setMessages(msgs || []);
        setPage(1);
        setHasMore(pagination ? pagination.currentPage < pagination.totalPages : false);
      })
      .catch(() => { })
      .finally(() => setMessagesLoading(false));
  }, [chatId]);

  // ── Step 3: Connect socket and bind events ──────────────────────────────────
  useEffect(() => {
    if (!chatId || !me) return;

    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      // Emit enter_chat so the backend marks messages as read and tracks active chat
      socket.emit(SOCKET_EVENTS.ENTER_CHAT, { chatId }, (ack) => {
        if (!ack?.success) console.warn("enter_chat ack failed", ack);
      });
    };

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        const msgId = message._id?.toString();

        // Avoid exact duplicate IDs
        if (msgId && prev.some((m) => m._id?.toString() === msgId)) return prev;

        const isFromMe =
          message.senderId?.toString() === myId ||
          message.senderId?._id?.toString() === myId;

        // If message is from me, replace any existing optimistic message
        if (isFromMe) {
          const hasOptimistic = prev.some((m) => m._optimistic);
          if (hasOptimistic) {
            let replaced = false;
            return prev.map((m) => {
              if (m._optimistic && !replaced) {
                replaced = true;
                return message;
              }
              return m;
            });
          }
        }

        return [message, ...prev];
      });
      scrollToBottom();
    };

    const handleMarkAsRead = ({ chatId: cid }) => {
      if (cid !== chatId) return;
      setMessages((prev) =>
        prev.map((m) => (m.senderId === myId ? { ...m, isRead: true, isDelivered: true } : m))
      );
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MARK_AS_READ, handleMarkAsRead);

    return () => {
      socket.off("connect", handleConnect);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MARK_AS_READ, handleMarkAsRead);

      // Emit leave_chat when unmounting
      socket.emit(SOCKET_EVENTS.LEAVE_CHAT, { chatId }, () => { });
    };
  }, [chatId, myId]);

  // Disconnect socket on component unmount
  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => {
    if (!messagesLoading) scrollToBottom();
  }, [messages.length, messagesLoading]);

  // ── Load more (pagination) ──────────────────────────────────────────────────
  const handleLoadMore = async () => {
    if (!chatId || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { messages: older, pagination } = await fetchMessages({ chatId, page: nextPage, limit: 30 });
      setMessages((prev) => [...prev, ...(older || [])]);
      setPage(nextPage);
      setHasMore(pagination ? pagination.currentPage < pagination.totalPages : false);
    } catch {
      ErrorToast("Failed to load older messages");
    } finally {
      setLoadingMore(false);
    }
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !chatId || sending) return;

    const text = messageInput.trim();
    setMessageInput("");
    setSending(true);

    // Optimistic message (will be replaced by socket broadcast)
    const optimistic = {
      _id: `opt-${Date.now()}`,
      chatId,
      senderId: myId,
      senderModel: "Bartender",
      type: "TEXT",
      payload: { text },
      isDelivered: false,
      isRead: false,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };
    setMessages((prev) => [optimistic, ...prev]);
    scrollToBottom();

    try {
      // REST call — backend controller calls emitNewMessage() which broadcasts via socket
      const sent = await sendMessageApi({ chatId, text, type: "TEXT" });
      const sentId = sent._id?.toString();

      setMessages((prev) => {
        // If socket already added this message, filter out optimistic item
        if (sentId && prev.some((m) => m._id?.toString() === sentId)) {
          return prev.filter((m) => m._id !== optimistic._id);
        }
        // Otherwise replace optimistic item with real message from REST
        return prev.map((m) => (m._id === optimistic._id ? sent : m));
      });
    } catch (err) {
      // Remove optimistic on failure and restore input
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      ErrorToast(err?.response?.data?.message || "Failed to send message");
      setMessageInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── Derive display data ─────────────────────────────────────────────────────
  const otherParticipant = activeChat?.otherParticipant || null;
  const managerName = getDisplayName(otherParticipant);
  const managerInitials = getInitials(otherParticipant);
  const groupedItems = groupMessagesByDate(messages);

  // ── Render ──────────────────────────────────────────────────────────────────
  if (chatsLoading || initiateChatMutation.isPending) {
    return (
      <div>
        <h2 className="section-heading my-3">Chat with Manager</h2>
        <div className="h-[calc(100vh-180px)] flex items-center justify-center bg-gray-50 rounded-2xl">
          <PageLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="section-heading my-3">Chat with Manager</h2>

      <div className="flex-1 flex bg-gray-50 rounded-2xl overflow-hidden min-h-0">
        {/* ── Chat Area ── */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <Avatar participant={otherParticipant} size="md" />
            <div>
              <h2 className="text-base font-semibold text-gray-900 leading-tight">{managerName}</h2>
              <p className="text-xs text-gray-400">Lounge Manager</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 min-h-0">
            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mb-3">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="text-xs text-[#010067] border border-[#010067] px-4 py-1.5 rounded-full hover:bg-[#010067] hover:text-white transition-all disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load older messages"}
                </button>
              </div>
            )}

            {messagesLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-[#010067] w-6 h-6" />
              </div>
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {groupedItems.map((item, idx) => {
                  if (item.type === "date") {
                    return (
                      <div key={item.id} className="flex justify-center py-3">
                        <span className="px-3 py-1 bg-gray-200 text-[#181818] text-xs rounded-md">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    );
                  }

                  const isOwn =
                    item.senderId?.toString() === myId ||
                    item.senderId?._id?.toString() === myId;
                  const itemKey = item._id?.toString() || `msg-${idx}`;

                  return (
                    <div
                      key={itemKey}
                      className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"} ${item._optimistic ? "opacity-70" : ""}`}
                    >
                      {!isOwn && (
                        <Avatar participant={otherParticipant} size="sm" className="mb-1" />
                      )}

                      <div
                        className={`max-w-[65%] rounded-2xl px-4 py-2.5 ${isOwn
                          ? "bg-gradient-to-br from-[#010067] to-black text-white rounded-br-sm"
                          : "bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100"
                          }`}
                      >
                        {/* Image */}
                        {item.payload?.mediaUrl && item.type === "IMAGE" && (
                          <img
                            src={item.payload.mediaUrl}
                            alt="media"
                            className="mb-2 rounded-lg max-h-60 object-cover w-full"
                          />
                        )}

                        {/* Text */}
                        {item.payload?.text && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {item.payload.text}
                          </p>
                        )}

                        {/* Footer: time + read status */}
                        <div className={`flex items-center gap-1.5 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                          <span className={`text-[10px] ${isOwn ? "text-gray-300" : "text-gray-400"}`}>
                            {formatTime(item.createdAt)}
                          </span>
                          {/* {isOwn && (
                            <span className="text-[10px] text-gray-300">
                              {item.isRead ? "✓✓" : item.isDelivered ? "✓✓" : "✓"}
                            </span>
                          )} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-2 bg-[#EEEEEE] px-2 py-1 rounded-xl">
              {/* Attachment button (UI only — wire up upload endpoint when ready) */}
              {/* <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-[#010067] rounded-full hover:bg-gray-200 transition-all"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
              /> */}

              <input
                type="text"
                placeholder="Type Here..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!chatId || sending}
                className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none disabled:opacity-50 placeholder:text-gray-400"
              />

              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || !chatId || sending}
                className="w-10 h-10 bg-indigo-950 text-white rounded-xl flex items-center justify-center hover:bg-[#010067] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
