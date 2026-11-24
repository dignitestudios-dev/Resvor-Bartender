"use client";
import React, { useState } from "react";
import Table from "@/components/bookings/Table";
import DateAndMonthFilter from "@/components/common/DateAndMonthFilter";

const BookingsPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  const handleApplyFilter = (start, end) => {
    setStartDate(start || null);
    setEndDate(end || null);
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
        <div>
          <h1 className="section-heading">Bookings</h1>
          <p className="text-[15px] text-[#202224] mt-0.5">
            View and manage bookings for your assigned lounge
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DateAndMonthFilter
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 bg-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-blue-950 transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 bg-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-blue-950 transition-colors"
            >
              <option value="">Sort: Default</option>
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="bookingDate:asc">Booking Date (Earliest)</option>
              <option value="bookingDate:desc">Booking Date (Latest)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Table
          startDate={startDate}
          endDate={endDate}
          status={status}
          sort={sort}
          onStatusChange={setStatus}
        />
      </div>
    </div>
  );
};

export default BookingsPage;
