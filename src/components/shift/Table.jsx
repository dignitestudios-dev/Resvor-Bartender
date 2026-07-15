"use client";
import React, { useState } from "react";
import CustomPagination from "@/components/common/CustomPagination";
import { IoIosArrowForward } from "react-icons/io";
import UpcomingShiftModal from "./UpcomingShiftModal";
import RequestShiftSwapModal from "@/components/requests/RequestShiftSwapModal";
import RequestTimeOffModal from "@/components/requests/RequestTimeOffModal";
import SuccessModal from "../global/SuccessModal";
import { useGetMyShifts } from "@/lib/hooks/queries/useShifts";
import utils from "@/lib/utils";

const Table = ({ startDate, endDate }) => {
  const [shiftModal, setShiftModal] = useState(false);
  const [timeOffOpen, setTimeOffOpen] = useState(false);
  const [shiftSwapOpen, setShiftSwapOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState(null);

  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { data: shiftsResponse, isLoading } = useGetMyShifts({
    page,
    limit: LIMIT,
    startDate: startDate || "",
    endDate: endDate || "",
  });

  const shifts = shiftsResponse?.data || [];
  const totalPages = shiftsResponse?.pagination?.totalPages || 1;

  const getStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "published" || lowerStatus === "upcoming") {
      return "text-[#28A745]"; // Green
    }
    return "text-gray-500"; // Gray
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
  ];

  // Map API response to visually normalized shifts
  const normalizedShifts = shifts.map((shift) => {
    const startStr = utils.formatTime12(shift.startDateTime);
    const endStr = utils.formatTime12(shift.endDateTime);
    return {
      _id: shift._id,
      date: utils.formatDateWithName(shift.startDateTime) || "-",
      time: startStr && endStr ? `${startStr} - ${endStr}` : "-",
      type: shift.role || "-",
      reason: shift.referenceId?.title || shift.referenceId?.name || shift.referenceId || "-",
      submitted: shift.instructions || "-",
      status: shift.status || "pending",
      startDateTime: shift.startDateTime,
    };
  });

  // Client-side filtering for activeTab (Upcoming/Past/All)
  const filteredShifts = normalizedShifts.filter((s) => {
    if (!s.startDateTime) return true;
    const shiftDate = new Date(s.startDateTime);
    const now = new Date();
    if (activeTab === "upcoming") {
      return shiftDate >= now;
    }
    if (activeTab === "past") {
      return shiftDate < now;
    }
    return true;
  });

  return (
    <CustomPagination
      loading={isLoading}
      onPageChange={onPageChange}
      totalPages={totalPages}
    >
      <div className="bg-white rounded-xl overflow-x-auto">
        <nav className="flex flex-wrap gap-1 md:gap-2 mx-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                  px-3 py-2 text-[16px] transition-all duration-200
                   whitespace-nowrap
                  ${activeTab === tab.key
                  ? " text-blue-950 font-semibold"
                  : " text-[#727272] hover:text-gray-700 "
                }
                `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <table className="w-full table-fixed min-w-[900px] text-[14px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#E8E8FF] font-medium">
              <th className="w-[14.28%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Date
              </th>
              <th className="w-[14.28%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Time
              </th>
              <th className="w-[14.28%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Role
              </th>
              <th className="w-[14.28%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Event
              </th>
              <th className="w-[14.28%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Notes
              </th>
              <th className="w-[14.28%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Status
              </th>
              <th className="w-[14.28%] px-4 py-5 text-center text-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredShifts.length > 0 ? (
              filteredShifts.map((shift, index) => {
                const displayStatus = shift.status?.toLowerCase() === "published" ? "Upcoming" : "Completed";
                return (
                  <tr key={index} className="border-b border-[#D4D4D4]">
                    <td className="px-4 py-5 truncate" title={shift.date}>
                      {shift.date}
                    </td>
                    <td className="px-4 py-5 truncate" title={shift.time}>
                      {shift.time}
                    </td>
                    <td className="px-4 py-5 truncate" title={shift.type}>
                      {shift.type}
                    </td>
                    <td className="px-4 py-5 truncate" title={shift.reason}>
                      {shift.reason}
                    </td>
                    <td className="px-4 py-5">
                      <div className="truncate" title={shift.submitted}>
                        {shift.submitted}
                      </div>
                    </td>
                    <td className={`px-4 py-5 truncate ${getStatusColor(shift.status)}`} title={displayStatus}>
                      {displayStatus}
                    </td>
                    <td className="px-4 py-5">
                      <div
                        onClick={() => {
                          setSelectedShiftId(shift._id);
                          setShiftModal(true);
                        }}
                        className="flex justify-center items-center cursor-pointer"
                      >
                        <IoIosArrowForward size={20} />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No records found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {shiftModal && (
          <UpcomingShiftModal
            isOpen={shiftModal}
            onOpenChange={setShiftModal}
            setTimeOffOpen={setTimeOffOpen}
            setShiftSwapOpen={setShiftSwapOpen}
            shiftId={selectedShiftId}
          />
        )}

        {/* Child dialogs */}
        {timeOffOpen && (
          <RequestTimeOffModal
            isOpen={timeOffOpen}
            onOpenChange={(val) => setTimeOffOpen(val)}
            setSuccessModal={setSuccessModal}
            defaultDate={
              selectedShiftId
                ? shifts.find((s) => s._id === selectedShiftId)?.startDateTime
                : null
            }
          />
        )}
        {shiftSwapOpen && (
          <RequestShiftSwapModal
            isOpen={shiftSwapOpen}
            onOpenChange={(val) => setShiftSwapOpen(val)}
            setSuccessModal={setSuccessModal}
            defaultShiftId={selectedShiftId}
          />
        )}
        {successModal && (
          <SuccessModal
            isOpen={successModal}
            onOpenChange={(val) => setSuccessModal(val)}
            title="Request Submitted"
            content="Your request has been successfully submitted."
          />
        )}
      </div>
    </CustomPagination>
  );
};

export default Table;
