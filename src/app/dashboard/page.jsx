import React from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import { dashboardStats } from "@/lib/constants";
import ShiftsCard from "@/components/dashboard/ShiftsCard";
import RequestStatusCard from "@/components/dashboard/RequestStatusCard";

// import Table from "@/components/dashboard/Table";
// import DateAndMonthFilter from "@/components/common/DateAndMonthFilter";

const Dashboard = () => {
  const dummyDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const dummyShifts = [
    {
      time: "06:00 PM - 02:00 AM",
      location: "Main Bar",
      eventType: "VIP Event - Premium Cocktail Menu",
      role: "Bartender",
    },
    {
      time: "04:00 PM - 11:00 PM",
      location: "Rooftop Lounge",
      eventType: "Corporate Reception",
      role: "Bartender",
    },
    {
      time: "08:00 PM - 03:00 AM",
      location: "VIP Lounge",
      eventType: "Private Party - Signature Cocktails",
      role: "Head Bartender",
    },
  ];
  const dummyRequests = [
    {
      title: "Time Off",
      date: "September 10, 2025",
      submitted: "Submitted 2 days ago",
      status: "Pending",
    },
    {
      title: "Shift Swap",
      date: "October 02, 2025",
      submitted: "Submitted 5 days ago",
      status: "Approved",
    },
    {
      title: "Schedule Change",
      date: "November 01, 2025",
      submitted: "Submitted 10 days ago",
      status: "Rejected",
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center gap-10">
        <h1 className="section-heading">Dashboard</h1>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-5">
        {dashboardStats.map((stats, index) => (
          <StatsCard key={index} stats={stats} />
        ))}
      </div>

      <div className="mt-4">
        <div className="p-4 rounded-[18px] border-[1px] border-[#b9b9b950] bg-white text-[#202224]">
          <p className="text-[20px] font-semibold ">Upcoming Shifts</p>
          <p className="text-[16px] ">Your Next assigned shifts</p>
          <div className="grid grid-cols-3 gap-2 py-2">
            {dummyShifts.map((shift, index) => (
              <ShiftsCard key={index} date={dummyDate} {...shift} />
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 rounded-[18px] border-[1px] border-[#b9b9b950] bg-white text-[#202224]">
          <p className="text-[20px] font-semibold ">Request Status</p>
          <p className="text-[16px] ">Your Recent requests and their status</p>
          <div className="grid grid-cols-3 gap-2 py-2">
            {dummyRequests.map((req, index) => (
              <RequestStatusCard key={index} {...req} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
