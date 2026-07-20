"use client";
import React, { useEffect, useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import ShiftsCard from "@/components/dashboard/ShiftsCard";
import RequestStatusCard from "@/components/dashboard/RequestStatusCard";
import NotificationModal from "@/components/dashboard/NotificationModal";
import PageLoader from "@/components/common/PageLoader";
import Bookings from "@/components/icons/sidebar/bookings";
import EventManagement from "@/components/icons/sidebar/event-management";
import Chat from "@/components/icons/sidebar/chat";
import { useGetNotifications } from "@/lib/hooks/queries/useNotifications";
import { useGetDashboard } from "@/lib/hooks/queries/useDashboard";
import utils from "@/lib/utils";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetDashboard();

  const { data: notifications = [], isLoading: notificationsLoading } =
    useGetNotifications();

  // Show modal only when notifications have loaded and there is at least one unread
  useEffect(() => {
    if (!notificationsLoading) {
      const unreadCount = notifications.filter(
        (n) => !(n.read === true || n.isRead === true)
      ).length;
      setShowModal(unreadCount > 0);
    }
  }, [notifications, notificationsLoading]);

  const statsList = [
    {
      title: "Upcoming Shifts",
      value: dashboardData?.upcomingShiftsCount ?? 0,
      icon: <Bookings size={28} />,
    },
    {
      title: "Pending Requests",
      value: dashboardData?.pendingRequestsCount ?? 0,
      icon: <EventManagement size={28} />,
    },
    {
      title: "Unread Messages",
      value: dashboardData?.unreadMessagesCount ?? 0,
      icon: <Chat size={28} />,
    },
  ];

  const upcomingShifts = (dashboardData?.upcomingShifts || []).slice(0, 3);
  const recentRequests = (dashboardData?.recentRequests || []).slice(0, 3);

  if (isDashboardLoading) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-10 mt-4">
        <h1 className="section-heading">Dashboard</h1>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statsList.map((stats, index) => (
          <StatsCard key={index} stats={stats} />
        ))}
      </div>

      <div className="mt-4">
        <div className="p-4 rounded-[18px] border-[1px] border-[#b9b9b950] bg-white text-[#202224]">
          <p className="text-[20px] font-semibold">Upcoming Shifts</p>
          <p className="text-[16px]">Your Next assigned shifts</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2">
            {upcomingShifts.length > 0 ? (
              upcomingShifts.map((shift, index) => {
                const shiftDate = shift.startDateTime
                  ? utils.formatDateWithName(shift.startDateTime)
                  : "N/A";
                const startStr = shift.startDateTime
                  ? utils.formatTime12(shift.startDateTime)
                  : "";
                const endStr = shift.endDateTime
                  ? utils.formatTime12(shift.endDateTime)
                  : "";
                const timeRange =
                  startStr && endStr ? `${startStr} - ${endStr}` : "N/A";

                return (
                  <ShiftsCard
                    key={shift._id || index}
                    date={shiftDate}
                    time={timeRange}
                    location={shift.location || "N/A"}
                    eventType={shift.description || "N/A"}
                    role={shift.role || "Bartender"}
                  />
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-6 text-gray-500 font-medium">
                No upcoming shifts assigned.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 rounded-[18px] border-[1px] border-[#b9b9b950] bg-white text-[#202224]">
          <p className="text-[20px] font-semibold">Request Status</p>
          <p className="text-[16px]">Your Recent requests and their status</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2">
            {recentRequests.length > 0 ? (
              recentRequests.map((req, index) => {
                const isTimeOff =
                  req.type === "time_off" || req.type === "time-off";
                const title = isTimeOff
                  ? "Time Off"
                  : req.type === "shift_swap" || req.type === "shift-swap"
                    ? "Shift Swap"
                    : utils.capitalize(req.type?.replace("_", " ") || "Request");

                const date = req.date
                  ? utils.formatDateWithName(req.date)
                  : "N/A";
                const submitted = req.createdAt
                  ? `Submitted ${utils.formatDateWithName(req.createdAt)}`
                  : "";
                const status = req.status || "Pending";

                return (
                  <RequestStatusCard
                    key={req._id || index}
                    title={title}
                    date={date}
                    submitted={submitted}
                    status={status}
                  />
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-6 text-gray-500 font-medium">
                No recent requests found.
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <NotificationModal
          isOpen={showModal}
          onOpenChange={(val) => setShowModal(val)}
        />
      )}
    </div>
  );
};

export default Dashboard;
