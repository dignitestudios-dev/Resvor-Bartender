import { useQuery } from "@tanstack/react-query";
import { fetchChats, fetchMessages } from "../api/ChatApi";

/**
 * Fetches all chats for the authenticated bartender.
 * The API returns pre-formatted chats with otherParticipant and lastMessage populated.
 */
export const useGetChats = (options = {}) => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Fetches paginated messages for a specific chat.
 * Enabled only when chatId is provided.
 */
export const useGetMessages = (chatId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ["chat-messages", chatId, params],
    queryFn: () => fetchMessages({ chatId, ...params }),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
    ...options,
  });
};
