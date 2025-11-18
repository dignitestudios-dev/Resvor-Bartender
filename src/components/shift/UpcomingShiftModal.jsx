import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const UpcomingShiftModal = ({
  isOpen,
  onOpenChange,
  setTimeOffOpen,
  setShiftSwapOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={"max-w-md p-8"}>
        <DialogHeader>
          <div className="flex items-center justify-between w-full border-b-2 ">
            <DialogTitle className="text-[28px] font-bold text-[#181818] py-2">
              Upcoming Shift
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="">
          <h4 className="text-[16px] text-[#181818] font-semibold mb-3">
            Shift Details
          </h4>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[14px] font-medium text-[#737373]">Date</p>
              <p className="text-[14px] font-semibold text-[#181818] mt-1">
                26 Dec, 2024
              </p>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#737373]">Time</p>
              <p className="text-[14px] font-semibold text-[#181818] mt-1">
                06:00pm
              </p>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#737373]">Role</p>
              <p className="text-[14px] font-semibold text-[#181818] mt-1">
                Bar Server
              </p>
            </div>
          </div>

          <hr className="border-t-2 mb-4" />

          <div className="mb-4">
            <p className="text-[14px] font-semibold text-[#181818] mb-2">
              Event
            </p>
            <p className="text-[14px] text-[#737373]">
              Corporate Networking Night
            </p>
          </div>

          <hr className="border-t-2 mb-4" />

          <div className="mb-6">
            <p className="text-sm text-[#111827] font-semibold mb-2">
              Any Instruction{" "}
              <span className="text-sm text-[#9CA3AF]">(optional)</span>
            </p>
            <p className="text-[14px] text-[#636363]">
              The standard Lorem Ipsum passage, m ipsum dolor sit amet, cectetur
              adipiscing elit, sed do eiusmod. The standard.
            </p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-center gap-4 w-full">
            <Button
              onClick={() => {
                onOpenChange(false);
                setTimeOffOpen(true);
              }}
              className={" py-3 px-4 font-medium "}
            >
              Request Time Off
            </Button>

            <Button
              onClick={() => {
                onOpenChange(false);
                setShiftSwapOpen(true);
              }}
              className={" py-3 px-4 font-medium "}
            >
              Request Shift Swap
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpcomingShiftModal;
