import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { baseUrl } from "@/axios";

let socket = null;

/**
 * Returns a singleton Socket.IO client connected to the backend.
 * Passes the JWT as `auth.token` – matches the backend authenticateSocket middleware.
 */
export const getSocket = () => {
  if (socket && socket.connected) return socket;

  const token = Cookies.get("token") || Cookies.get("authorization") || "";

  socket = io(baseUrl, {
    auth: { token: token ? `Bearer ${token}` : "" },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
};

/**
 * Disconnects and nullifies the singleton.
 * Call this on logout or unmount of the chat feature.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const SOCKET_EVENTS = Object.freeze({
  ENTER_CHAT: "enter_chat",
  LEAVE_CHAT: "leave_chat",
  NEW_MESSAGE: "new_message",
  MARK_AS_READ: "mark_as_read",
});
