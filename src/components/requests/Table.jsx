"use client";
import React, { useState } from "react";
import CustomPagination from "@/components/common/CustomPagination";
import { useGetMyShiftRequests } from "@/lib/hooks/queries/useShiftRequests";
import utils from "@/lib/utils";

const Table = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const LIMIT = 10;

  const { data: requestsResponse, isLoading } = useGetMyShiftRequests({
    page,
    limit: LIMIT,
    status: activeTab,
  });

  const shifts = requestsResponse?.data || [];
  const totalPages = requestsResponse?.pagination?.totalPages || 1;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-[#FFAE10]"; // orange
      case "unfilled":
      case "rejected":
        return "text-[#DC3545]"; // red
      case "confirmed":
      case "approved":
        return "text-[#28A745]"; // green
      default:
        return "text-gray-500";
    }
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  // Map API response to visually normalized requests
  const normalizedRequests = shifts.map((req) => {
    const isTimeOff = req.type === "time-off" || req.type === "time_off" || !req.requestorShiftId;
    const typeLabel = isTimeOff ? "Time Off" : "Shift Swap";

    let dateLabel = "-";
    let timeLabel = "-";

    if (isTimeOff) {
      const start = req.startDate ? utils.formatDateWithName(req.startDate) : "";
      const end = req.endDate ? utils.formatDateWithName(req.endDate) : "";
      if (start && end) {
        dateLabel = start === end ? start : `${start} - ${end}`;
      } else {
        dateLabel = start || end || (req.createdAt ? utils.formatDateWithName(req.createdAt) : "-");
      }
      timeLabel = "All Day";
    } else {
      const shiftObj = req.requestorShiftId || req.requestorShift;
      if (shiftObj && shiftObj.startDateTime) {
        dateLabel = utils.formatDateWithName(shiftObj.startDateTime);
        const startStr = utils.formatTime12(shiftObj.startDateTime);
        const endStr = utils.formatTime12(shiftObj.endDateTime);
        timeLabel = startStr && endStr ? `${startStr} - ${endStr}` : "-";
      } else {
        dateLabel = req.createdAt ? utils.formatDateWithName(req.createdAt) : "-";
        timeLabel = "-";
      }
    }

    const reasonLabel = req.reason || "-";

    let submittedLabel = "Self";
    if (!isTimeOff) {
      const targetShift = req.targetShiftId || req.targetShift;
      const targetBartender = targetShift?.bartenderId || req.targetBartenderId;
      if (targetBartender) {
        const name = typeof targetBartender === "object"
          ? `${targetBartender.firstName || ""} ${targetBartender.lastName || ""}`.trim() || targetBartender.name || targetBartender.email
          : targetBartender;
        submittedLabel = name ? `Swap with ${name}` : "Shift Swap";
      } else {
        submittedLabel = "Shift Swap";
      }
    } else {
      submittedLabel = req.submitted || "Self";
    }

    return {
      _id: req._id,
      date: dateLabel,
      time: timeLabel,
      type: typeLabel,
      reason: reasonLabel,
      submitted: submittedLabel,
      status: req.status || "pending",
    };
  });

  return (
    <CustomPagination
      loading={isLoading}
      onPageChange={onPageChange}
      totalPages={totalPages}
    >
      <div className="bg-white rounded-xl overflow-y-auto">
        <nav className="flex flex-wrap gap-1 md:gap-2 mx-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
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
            </tr>
          </thead>
          <tbody>
            {normalizedRequests.length > 0 ? (
              normalizedRequests.map((shift, index) => (
                <tr key={shift._id || index} className="border-b border-[#D4D4D4]">
                  <td className="px-8 py-5">
                    {shift.date}
                  </td>
                  <td className="px-6 py-5">{shift.time}</td>
                  <td className="px-8 py-5">{shift.type}</td>
                  <td className="px-6 py-5">{shift.reason}</td>
                  <td className="px-8 py-5">{shift.submitted}</td>
                  <td className={`px-8 py-5 ${getStatusColor(shift.status)}`}>
                    {utils.capitalize(shift.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No records found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CustomPagination>
  );
};

export default Table;
