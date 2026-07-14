import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../api/NotificationApi";

export const useGetNotifications = (options = {}) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchOnWindowFocus: true,
    ...options,
  });
};
