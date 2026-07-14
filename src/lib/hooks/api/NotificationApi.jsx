import axios from "../../../axios";

// Fetch notifications
export const fetchNotifications = async () => {
  const { data } = await axios.get("/notifications");
  return data?.data || data || [];
};

// Mark a single notification as read
export const markNotificationAsRead = async ({ id, title, description }) => {
  const { data } = await axios.patch(`/notifications/${id}/read`, {
    title,
    description,
  });
  return data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async ({ title, description } = {}) => {
  const { data } = await axios.patch("/notifications/read-all", {
    title: title || "Test Notification Title",
    description: description || "This is a test notification description",
  });
  return data;
};
