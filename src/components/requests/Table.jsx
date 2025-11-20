"use client";
import React, { useState } from "react";
import CustomPagination from "@/components/common/CustomPagination";
import { IoIosArrowForward } from "react-icons/io";

const Table = () => {
  const shifts = [
    {
      date: "2025-12-01",
      time: "06:00 PM - 12:00 AM",
      type: "Bartender",
      reason: "Team Building Event",
      submitted: "Requested by HR",
      status: "pending",
    },
    {
      date: "2025-12-02",
      time: "05:30 PM - 11:30 PM",
      type: "Head Bartender",
      reason: "Product Launch",
      submitted: "Auto-assigned",
      status: "confirmed",
    },
    {
      date: "2025-12-03",
      time: "07:00 PM - 01:00 AM",
      type: "Assistant Bartender",
      reason: "Wedding Ceremony",
      submitted: "Requested by client",
      status: "unfilled",
    },
    {
      date: "2025-12-04",
      time: "04:00 PM - 10:00 PM",
      type: "Bar Manager",
      reason: "VIP Dinner",
      submitted: "Manual entry",
      status: "pending",
    },
    {
      date: "2025-12-05",
      time: "08:00 PM - 02:00 AM",
      type: "Bartender",
      reason: "Club Night",
      submitted: "Auto-assigned",
      status: "confirmed",
    },
    {
      date: "2025-12-06",
      time: "06:30 PM - 12:30 AM",
      type: "Head Bartender",
      reason: "Charity Auction",
      submitted: "Requested by sponsor",
      status: "pending",
    },
    {
      date: "2025-12-07",
      time: "05:00 PM - 11:00 PM",
      type: "Assistant Bartender",
      reason: "Holiday Market",
      submitted: "Manual entry",
      status: "unfilled",
    },
    {
      date: "2025-12-08",
      time: "07:30 PM - 01:30 AM",
      type: "Bar Manager",
      reason: "Fashion Show",
      submitted: "Requested by organizer",
      status: "confirmed",
    },
    {
      date: "2025-12-09",
      time: "06:00 PM - 11:00 PM",
      type: "Bartender",
      reason: "Live Music Night",
      submitted: "Auto-assigned",
      status: "pending",
    },
    {
      date: "2025-12-10",
      time: "05:30 PM - 10:30 PM",
      type: "Head Bartender",
      reason: "Corporate Dinner",
      submitted: "Requested by CEO",
      status: "confirmed",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-[#FFAE10]"; // orange
      case "unfilled":
        return "text-[#DC3545]"; // red
      case "confirmed":
        return "text-[#28A745]"; // green
      default:
        return "text-gray-500";
    }
  };

  const onPageChange = (page) => {
    // handle pagination
  };

  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <CustomPagination
      loading={false}
      onPageChange={onPageChange}
      totalPages={5}
    >
      <div className="bg-white rounded-xl overflow-y-auto">
        <nav className="flex flex-wrap gap-1 md:gap-2 mx-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                  px-3 py-2 text-[16px] transition-all duration-200
                   whitespace-nowrap
                  ${
                    activeTab === tab.key
                      ? " text-blue-950 font-[600]"
                      : " text-[#727272] hover:text-gray-700 "
                  }
                `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <table className="w-full text-[14px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#E8E8FF] font-medium">
              <th className="px-8 py-5 text-left text-nowrap">Date</th>
              <th className="px-6 py-5 text-left text-nowrap">Shift Time</th>
              <th className="px-8 py-5 text-left text-nowrap">Type</th>
              <th className="px-6 py-5 text-left text-nowrap">Reason</th>
              <th className="px-8 py-5 text-left text-nowrap">Submitted</th>
              <th className="px-8 py-5 text-left text-nowrap">Status</th>
              <th className="px-8 py-5 text-center text-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index} className="border-b border-[#D4D4D4]">
                <td className="px-8 py-5">
                  {shift.date}
                  {/* {utils.formatDateWithName(shift.date)} */}
                </td>
                <td className="px-6 py-5">{shift.time}</td>
                <td className="px-8 py-5">{shift.type}</td>
                <td className="px-6 py-5">{shift.reason}</td>
                <td className="px-8 py-5">{shift.submitted}</td>
                <td className={`px-8 py-5 ${getStatusColor(shift.status)}`}>
                  {/* {utils.capitalize(shift.status)} */}
                  {shift.status}
                </td>
                <td className="px-8 py-5">
                  <div
                    onClick={() => setShiftModal(true)}
                    className="flex justify-center items-center cursor-pointer"
                  >
                    <IoIosArrowForward size={20} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomPagination>
  );
};

export default Table;
