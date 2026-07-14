import { useMutation } from "@tanstack/react-query";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/NotificationApi";

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: markNotificationAsRead,
  });
};

export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
  });
};
