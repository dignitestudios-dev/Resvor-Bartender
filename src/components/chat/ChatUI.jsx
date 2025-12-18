"use client";
import React, { useRef, useState } from "react";
import { Send, Search } from "lucide-react";
import { Button } from "../ui/button";

export default function ChatUI() {
  const fileInputRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");

  const [chatState, setChatState] = useState([
    {
      id: 1,
      sender: "Manager",
      message: "Hello! How can I help you today?",
      time: "09:20 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      message: "I need some information regarding the lounge.",
      time: "09:22 AM",
      isOwn: true,
    },
  ]);
  console.log("🚀 ~ ChatUI ~ chatState:", chatState);

  const handleSendMessage = () => {
    if (!messageInput.trim() && !fileInputRef.current?.files[0]) return;

    const file = fileInputRef.current?.files[0];
    console.log("🚀 ~ handleSendMessage ~ file:--->", file);
    const newMessage = {
      id: Date.now(),
      sender: "You",
      message: messageInput,
      image: file ? URL.createObjectURL(file) : null,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setChatState((prev) => [...prev, newMessage]);
    setMessageInput("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h2 className="section-heading my-3">Chat with Manager</h2>

      <div className="h-full flex bg-gray-50 rounded-2xl overflow-hidden">
        {/* Right Chat Area */}
        <div className="flex-1 flex flex-col">
          {chatState.length > 0 ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold">
                  MR
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Manager</h2>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Today Label */}
                <div className="flex justify-center ">
                  <span className="px-3 py-1 bg-gray-200 text-[#181818] text-xs rounded-md">
                    Today
                  </span>
                </div>

                {/* Chat Messages */}
                {chatState.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex ${
                      chat.isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!chat.isOwn && (
                      <div className="w-10 h-10 mr-2 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold">
                        MR
                      </div>
                    )}

                    <div
                      className={`max-w-md rounded-xl px-4 py-2 ${
                        chat.isOwn
                          ? "bg-gradient-to-br from-[#010067] to-black text-white rounded-tr-none"
                          : "bg-gray-200 text-gray-900 rounded-tl-none"
                      }`}
                    >
                      {chat.image && (
                        <img
                          src={chat.image}
                          alt="uploaded"
                          className="mb-2 rounded-lg max-h-60 object-cover"
                        />
                      )}
                      {chat.message && (
                        <p className="text-sm leading-relaxed">
                          {chat.message}
                        </p>
                      )}
                      <span
                        className={`block text-xs mt-1 ${
                          chat.isOwn ? "text-gray-200" : "text-gray-500"
                        }`}
                      >
                        {chat.time}
                      </span>
                    </div>

                    {chat.isOwn && <div className="w-10 ml-2" />}
                  </div>
                ))}
              </div>

              {/* Input Area */}
              {/* <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type Here..."
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div> */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center gap-3 bg-[#EEEEEE] p-1 rounded-xl">
                  <input
                    type="text"
                    placeholder="Type Here..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 px-4 py-3 text-sm bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary "
                  />
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={() => handleSendMessage()}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className=" bg-transparent text-white flex items-center justify-center hover:bg-gray-50 p-2 rounded-full transition-all"
                  >
                    📎
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="w-10 h-10 bg-indigo-950 text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>No chat with manager yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
