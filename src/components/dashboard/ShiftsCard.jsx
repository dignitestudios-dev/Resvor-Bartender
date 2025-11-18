import React from "react";
import { GoClockFill } from "react-icons/go";
import { IoLocation } from "react-icons/io5";
import { BiSolidBadgeDollar } from "react-icons/bi";

const ShiftsCard = ({
  date = "Today",
  time = "06:00 PM - 02:00 AM",
  location = "Main Bar",
  eventType = "VIP Event - Premium Cocktail Menu",
  role = "Bartender",
}) => {
  return (
    <div className="p-4 rounded-[18px] border-[1px] border-[#b9b9b950] bg-white">
      <div className="flex justify-between items-center">
        <p className="text-[20px] font-semibold">{date}</p>
        <div className="bg-gradient text-white text-[14px] rounded-4xl px-3 py-1.5">
          {role}
        </div>
      </div>
      <ul className="space-y-2 list-none">
        <li className="flex items-center gap-2 text-[#6E6E6E]">
          <GoClockFill className="text-lg" />
          <span>{time}</span>
        </li>
        <li className="flex items-center gap-2 text-[#6E6E6E]">
          <IoLocation className="text-xl" />
          <span>{location}</span>
        </li>

        <li className="flex items-center gap-2 text-[#6E6E6E]">
          <BiSolidBadgeDollar className="text-xl" />
          <span>{eventType}</span>
        </li>
      </ul>
    </div>
  );
};

export default ShiftsCard;
