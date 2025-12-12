"use client";
import React from "react";
import { FaFilter } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { months } from "@/lib/constants";
import utils from "@/lib/utils";

const DateAndMonthFilter = ({
  onApply,
  onClear,
  initialStartDate,
  initialEndDate,
}) => {
  const [start, setStart] = React.useState(initialStartDate || "");
  const [end, setEnd] = React.useState(initialEndDate || "");

  React.useEffect(() => {
    setStart(initialStartDate || "");
    setEnd(initialEndDate || "");
  }, [initialStartDate, initialEndDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onApply) onApply(start || null, end || null);
  };

  const handleClear = () => {
    setStart("");
    setEnd("");
    if (onClear) onClear();
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className={"h-10 w-10 bg-gradient"}>
          <FaFilter className="h-4 w-4 min-h-4 min-w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex gap-5 justify-between items-center border-b border-b-gray-200 pb-3 ">
          <p className="text-xl font-semibold">Filter</p>
          {/* <RxCross2 className="text-black text-2xl" /> */}
          <span />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 mt-5 ">
          <div className="flex flex-col gap-1">
            <Label className={"text-base"}>Start Date</Label>
            <Input
              placeholder="Select Date"
              type={"date"}
              className={" h-14"}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className={"text-base"}>End Date</Label>
            <Input
              placeholder="Select Date"
              type={"date"}
              className={" h-14"}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          {/* <div className="col-span-2 flex flex-col gap-1">
            <Label className={"text-base"}>Select Month</Label>

            <Select>
              <SelectTrigger className={"w-full h-14!"}>
                <SelectValue placeholder="Select a Month" />
              </SelectTrigger>
              <SelectContent className={"h-[200px]"}>
                <SelectGroup>
                  <SelectLabel>Months</SelectLabel>
                  {months.map((month, index) => (
                    <SelectItem value={month} key={index}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div> */}

          <Button
            type="button"
            onClick={handleClear}
            className={"h-14!"}
            variant={"secondary"}
          >
            Clear
          </Button>

          <Button type="submit" className={"h-14!"}>
            Apply
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DateAndMonthFilter;
