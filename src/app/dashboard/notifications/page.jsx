"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import NotificationSection from "@/components/notification/NotificationSection";
import { useMarkAllNotificationsAsRead } from "@/lib/hooks/mutations/NotificationMutations";
import { useQueryClient } from "@tanstack/react-query";

const Notifications = () => {
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const queryClient = useQueryClient();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync({
        title: "Test Notification Title",
        description: "This is a test notification description",
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      console.error("Error marking all notifications as read", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-10 mt-2">
        <h1 className="section-heading">Notifications</h1>
        <Button 
          className="py-3" 
          onClick={handleMarkAllAsRead}
          disabled={markAllAsReadMutation.isPending}
        >
          {markAllAsReadMutation.isPending ? "Marking..." : "Mark All as Read"}
        </Button>
      </div>
      <div className="mt-4 mr-12 ">
        <NotificationSection />
      </div>
    </div>
  );
};

export default Notifications;
