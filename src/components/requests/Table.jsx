"use client";
import React, { useState } from "react";
import CustomPagination from "@/components/common/CustomPagination";
import { useGetMyShiftRequests } from "@/lib/hooks/queries/useShiftRequests";
import utils from "@/lib/utils";

const Table = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    note: "",
  });
  const LIMIT = 10;

  const { data: requestsResponse, isLoading } = useGetMyShiftRequests({
    page,
    limit: LIMIT,
    status: activeTab,
  });

  const shifts = requestsResponse?.data || [];
  console.log("🚀 ~ Table ~ shifts:", shifts);
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
    const submittedDateLabel = req.createdAt ? utils.formatDateWithName(req.createdAt) : "-";

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
      submittedDateLabel,
      date: dateLabel,
      time: timeLabel,
      type: typeLabel,
      reason: reasonLabel,
      submitted: submittedLabel,
      status: req.status || "pending",
      reviewNote: req.reviewNote || null,
    };
  });

  const openRejectionModal = (note) => {
    setRejectionModal({ open: true, note: note || "No rejection reason provided." });
  };

  const closeRejectionModal = () => {
    setRejectionModal({ open: false, note: "" });
  };

  return (
    <>
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
                    ${activeTab === tab.key
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
                    <td className="px-6 py-5 max-w-[450px] break-all">{shift.reason}</td>
                    <td className="px-8 py-5">{shift.submittedDateLabel}</td>
                    <td className="px-8 py-5 font-medium">
                      {shift.status?.toLowerCase() === "rejected" && shift.reviewNote ? (
                        <button
                          onClick={() => openRejectionModal(shift.reviewNote)}
                          style={{ color: utils.getStatusColorHex(shift.status) }}
                          className="underline underline-offset-2 cursor-pointer hover:opacity-75 transition-opacity duration-150 bg-transparent border-none p-0 font-medium text-[14px]"
                          title="Click to view rejection reason"
                        >
                          {utils.getNormalizedStatus(shift.status)}
                        </button>
                      ) : (
                        <span style={{ color: utils.getStatusColorHex(shift.status) }}>
                          {utils.getNormalizedStatus(shift.status)}
                        </span>
                      )}
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

      {/* Rejection Reason Modal */}
      {rejectionModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={closeRejectionModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#DC3545" strokeWidth="2" />
                    <path d="M12 8v4m0 4h.01" stroke="#DC3545" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="text-[16px] font-semibold text-gray-800">Rejection Reason</h2>
              </div>
              <button
                onClick={closeRejectionModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150 bg-transparent border-none cursor-pointer text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <hr className="border-[#E8E8E8] mb-4" />

            {/* Body */}
            <p className="text-[14px] text-gray-700 leading-relaxed break-words">
              {rejectionModal.note}
            </p>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeRejectionModal}
                className="px-5 py-2 rounded-lg bg-[#DC3545] text-white text-[14px] font-medium hover:bg-red-700 transition-colors duration-150 cursor-pointer border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
