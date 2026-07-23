import axios from "../../../axios";

/**
 * POST /chats
 * Initiates or fetches an existing chat for the bartender.
 * Bartenders must provide loungeId (their assigned lounge).
 */
export const initiateChat = async (payload) => {
  const { data } = await axios.post("/chats", payload);
  return data?.data || data;
};

/**
 * GET /chats
 * Returns all chats for the authenticated bartender.
 */
export const fetchChats = async () => {
  const { data } = await axios.get("/chats");
  return data?.data || [];
};

/**
 * GET /chats/:chatId/messages
 * Returns paginated messages for a specific chat.
 */
export const fetchMessages = async ({ chatId, page = 1, limit = 30 }) => {
  const { data } = await axios.get(`/chats/${chatId}/messages`, {
    params: { page, limit },
  });
  return {
    messages: data?.data || [],
    pagination: data?.pagination || null,
  };
};

/**
 * POST /chats/:chatId/messages
 * Sends a text or media message to a specific chat.
 */
export const sendMessage = async ({ chatId, text, type = "TEXT", mediaUrl = null, fileName = null, fileSize = null, mimeType = null }) => {
  const { data } = await axios.post(`/chats/${chatId}/messages`, {
    type,
    text,
    mediaUrl,
    fileName,
    fileSize,
    mimeType,
  });
  return data?.data || data;
};
