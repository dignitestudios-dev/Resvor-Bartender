import { useMutation, useQueryClient } from "@tanstack/react-query";
import { initiateChat, sendMessage } from "../api/ChatApi";

/**
 * Initiates or retrieves an existing chat between the bartender and their lounge manager.
 */
export const useInitiateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: initiateChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

/**
 * Sends a message in a given chat via REST POST.
 * The gateway will broadcast the message to all room members via socket.
 */
export const useSendMessage = (chatId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => sendMessage({ chatId, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
    },
  });
};
