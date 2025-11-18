"use client";
import React, { useState } from "react";
import { Send, Search } from "lucide-react";
import { Button } from "../ui/button";

export default function ChatUI() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState(null);

  const chats = [
    {
      id: 1,
      sender: "John Doe",
      message: "labore et dolore magna aliqua.",
      time: "09:25 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elitelusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "09:25 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "John Doe",
      message: "labore et dolore magna aliqua.",
      time: "09:25 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "John Doe",
      message: "Sed ut perspiciatis",
      time: "09:25 AM",
      isOwn: false,
    },
    {
      id: 5,
      sender: "You",
      message: "Lorem ipsum dolor sit ut labore et dolore magna aliqua.",
      time: "09:25 AM",
      isOwn: true,
    },
  ];

  return (
    <div className="h-full flex bg-gray-50 rounded-2xl overflow-hidden">
      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col">
        {chats ? (
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
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  Today
                </span>
              </div>

              {/* Chat Messages */}
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex ${
                    chat.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  {!chat.isOwn && (
                    <div className="w-10 h-10 rounded-full bg-gradient flex items-center justify-center text-white font-semibold mr-3 shrink-0">
                      MR
                    </div>
                  )}
                  <div className="flex flex-col items-end">
                    <div
                      className={`max-w-md rounded-lg ${
                        chat.isOwn
                          ? "bg-gradient text-white rounded-tr-none"
                          : "bg-[#E6E6E6] text-gray-900 rounded-tl-none"
                      } px-4 py-2`}
                    >
                      <p className="text-sm">{chat.message}</p>
                    </div>

                    <span className={`text-xs mt-1 text-black`}>
                      {chat.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
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
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>No chat with manager yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
