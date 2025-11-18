import React from "react";

const RequestStatusCard = ({
  title = "Time Off",
  date = "September 10, 2025",
  submitted = "Submitted 2 days ago",
  status = "Pending",
}) => {
  const statusColors = {
    Pending: "#FFAE101A",
    Approved: "#20BD4A1A",
    Rejected: "#DC1D001A",
  };
  const statusTexts = {
    Pending: "#FFAE10",
    Approved: "#20BD4A",
    Rejected: "#DC1D00",
  };

  const bgColor = statusColors[status] || statusColors.Pending;
  const textColor = statusTexts[status] || statusColors.Pending;
  return (
    <div className="p-4 rounded-[18px] border-[1px] border-[#b9b9b950] bg-white">
      <div className="flex justify-between items-center">
        <p className="text-[20px] font-semibold">{title}</p>
        <div
          className="text-white text-[14px] rounded-4xl px-3 py-1.5"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {status}
        </div>
      </div>
      <div>
        <p className="text-[#6E6E6E] text-[14px] font-medium">{date}</p>
        <p className="text-[#6E6E6E] text-[14px] ">{submitted}</p>
      </div>
    </div>
  );
};

export default RequestStatusCard;
