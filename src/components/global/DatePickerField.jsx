import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import moment from "moment";

const DatePickerField = ({
  label = "Select Date",
  value,
  onChange,
  minDate = undefined,
  maxDate = undefined,
}) => {
  console.log("🚀 ~ DatePickerField ~ value:", value);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <label className="text-[14px] text-[#181818] font-[500] block">
        Date
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="border border-[#BEBEBE] rounded-[16px] mt-2 px-3 py-2 flex items-center justify-between text-sm cursor-pointer hover:border-gray-200 transition"
            onClick={() => setOpen(!open)}
          >
            <span className="text-[#727272]">
              {value ? moment(value).format("MMM DD, YYYY") : label}
            </span>

            <IoCalendarOutline className="text-blue-950 text-[20px]" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 mt-2 z-50 rounded-lg">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            fromDate={minDate}
            toDate={maxDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;
