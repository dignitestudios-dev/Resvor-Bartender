"use client";
import React, { useState } from "react";
import Table from "@/components/shift/Table";
import DateAndMonthFilter from "@/components/common/DateAndMonthFilter";

const Shifts = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("");

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
      <div className="flex justify-between items-center gap-10 mt-2">
        <h1 className="section-heading">Shifts </h1>

        {/* <div className="flex items-center gap-5">
          <AddShiftAndScheduling isOpen={openForm} onOpenChange={setOpenForm} />
        </div> */}
        <div className="flex items-center gap-5 ">
          <DateAndMonthFilter
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
          <div className="mx-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-950"
            >
              <option value="">All Statuses</option>             
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Table startDate={startDate} endDate={endDate} status={status} />
      </div>
    </div>
  );
};

export default Shifts;
