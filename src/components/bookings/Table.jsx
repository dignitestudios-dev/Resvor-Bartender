"use client";
import React, { useState } from "react";
import CustomPagination from "@/components/common/CustomPagination";
import { IoIosArrowForward } from "react-icons/io";
import { Loader2 } from "lucide-react";
import BookingDetailModal from "./BookingDetailModal";
import { useGetWorkforceBookings } from "@/lib/hooks/queries/useBookings";
import utils from "@/lib/utils";

const Table = ({
  startDate,
  endDate,
  status = "",
  sort = "",
  onStatusChange,
}) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // Determine effective status:
  const effectiveStatus =
    status && status !== "all"
      ? status
      : activeTab !== "all"
      ? activeTab
      : "";

  const { data: bookingsResponse, isLoading } = useGetWorkforceBookings({
    page,
    limit: LIMIT,
    startDate: startDate || "",
    endDate: endDate || "",
    status: effectiveStatus,
    sort: sort || "",
  });

  const bookings = bookingsResponse?.data || [];
  const totalPages = bookingsResponse?.pagination?.totalPages || 1;

  const tabs = [
    { key: "all", label: "All" },
    { key: "confirmed", label: "Confirmed" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
    if (onStatusChange && status) {
      onStatusChange("");
    }
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const getStatusBadgeStyle = (bookingStatus) => {
    const s = bookingStatus?.toLowerCase()?.trim() || "";
    switch (s) {
      case "completed":
      case "complete":
        return {
          textColor: "text-[#15803D]",
          bgColor: "bg-[#DCFCE7]",
          borderColor: "border-[#86EFAC]",
        };
      case "confirmed":
      case "confirm":
      case "accepted":
        return {
          textColor: "text-[#0052CC]",
          bgColor: "bg-[#EBF3FF]",
          borderColor: "border-[#B9D5FF]",
        };
      case "pending":
      case "awaiting_payment":
      case "incoming":
        return {
          textColor: "text-[#B45309]",
          bgColor: "bg-[#FEF3C7]",
          borderColor: "border-[#FDE68A]",
        };
      case "cancelled":
      case "canceled":
      case "rejected":
      case "failed":
        return {
          textColor: "text-[#B91C1C]",
          bgColor: "bg-[#FEE2E2]",
          borderColor: "border-[#FCA5A5]",
        };
      default:
        return {
          textColor: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
        };
    }
  };

  return (
    <CustomPagination
      loading={isLoading}
      onPageChange={onPageChange}
      totalPages={totalPages}
      currentPage={page}
    >
      <div className="bg-white rounded-xl overflow-x-auto">
        <nav className="flex flex-wrap gap-1 md:gap-2 mx-3 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`
                px-3 py-2 text-[15px] transition-all duration-200 whitespace-nowrap cursor-pointer rounded-lg
                ${
                  (status ? status === tab.key : activeTab === tab.key)
                    ? "text-blue-950 font-bold bg-blue-50"
                    : "text-[#727272] hover:text-gray-900"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <table className="w-full table-fixed min-w-[950px] text-[14px] mt-2">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#E8E8FF] font-medium">
              <th className="w-[18%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Guest Name
              </th>
              <th className="w-[14%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Lounge
              </th>
              <th className="w-[13%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Date
              </th>
              <th className="w-[15%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Time
              </th>
              <th className="w-[10%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Guests
              </th>
              <th className="w-[14%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Tables / Area
              </th>
              <th className="w-[10%] px-4 py-5 text-left text-[#202224] text-nowrap">
                Status
              </th>
              <th className="w-[6%] px-4 py-5 text-center text-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-950" />
                    <p className="text-sm font-medium">Loading bookings...</p>
                  </div>
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking, index) => {
                const guestName =
                  booking?.guestName ||
                  `${booking?.userId?.firstName || ""} ${
                    booking?.userId?.lastName || ""
                  }`.trim() ||
                  booking?.userId?.name ||
                  "Guest";

                const guestContact =
                  booking?.guestPhone ||
                  booking?.guestEmail ||
                  booking?.userId?.email ||
                  "";

                const loungeName =
                  booking?.loungeId?.name ||
                  booking?.loungeName ||
                  "-";

                const dateStr =
                  utils.formatDateWithName(
                    booking?.bookingDate || booking?.startTime
                  ) || "-";

                const startTimeStr = booking?.startTime
                  ? utils.formatTime12(booking?.startTime)
                  : "";
                const endTimeStr = booking?.endTime
                  ? utils.formatTime12(booking?.endTime)
                  : "";
                const timeStr =
                  startTimeStr && endTimeStr
                    ? `${startTimeStr} - ${endTimeStr}`
                    : startTimeStr || "-";

                const guestCount = booking?.guestCount || 1;
                const childrenCount = booking?.childrenCount ?? 0;

                // Tables display handling { code, type, capacity }
                const tablesList = Array.isArray(booking?.tableIds)
                  ? booking.tableIds
                      .map((t) => {
                        if (typeof t === "object" && t !== null) {
                          const code = t.code || t.name || t.tableNumber || "T";
                          const typeTag = t.type ? ` (${t.type.toUpperCase()})` : "";
                          return `${code}${typeTag}`;
                        }
                        return t;
                      })
                      .filter(Boolean)
                      .join(", ")
                  : typeof booking?.tableIds === "string"
                  ? booking.tableIds
                  : "";

                const seatingDisplay =
                  tablesList || booking?.preferredSeatingArea || "Standard";

                const statusBadge = getStatusBadgeStyle(booking?.status);
                const displayStatus = utils.getNormalizedStatus(booking?.status);

                return (
                  <tr
                    key={booking._id || index}
                    onClick={() => handleRowClick(booking)}
                    className="border-b border-[#D4D4D4] hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-5">
                      <div
                        className="truncate font-semibold text-gray-900"
                        title={guestName}
                      >
                        {guestName}
                      </div>
                      {guestContact && (
                        <div
                          className="truncate text-xs text-gray-500"
                          title={guestContact}
                        >
                          {guestContact}
                        </div>
                      )}
                    </td>
                    <td
                      className="px-4 py-5 truncate text-gray-800"
                      title={loungeName}
                    >
                      {loungeName}
                    </td>
                    <td
                      className="px-4 py-5 truncate text-gray-700"
                      title={dateStr}
                    >
                      {dateStr}
                    </td>
                    <td
                      className="px-4 py-5 truncate text-gray-700 text-nowrap"
                      title={timeStr}
                    >
                      {timeStr}
                    </td>
                    <td className="px-4 py-5 text-gray-800">
                      <span className="font-medium">{guestCount}</span>
                      {childrenCount > 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          (+{childrenCount})
                        </span>
                      )}
                    </td>
                    <td
                      className="px-4 py-5 truncate text-gray-700"
                      title={seatingDisplay}
                    >
                      {seatingDisplay}
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${statusBadge.textColor} ${statusBadge.bgColor} ${statusBadge.borderColor}`}
                      >
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(booking);
                        }}
                        className="p-1 hover:bg-gray-200 rounded-full transition cursor-pointer text-gray-500 hover:text-gray-800"
                        title="View Details"
                      >
                        <IoIosArrowForward size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-500 font-medium">
                  No Bookings Found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedBooking && isModalOpen && (
          <BookingDetailModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            booking={selectedBooking}
          />
        )}
      </div>
    </CustomPagination>
  );
};

export default Table;
