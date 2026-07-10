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
import { useGetMyShiftById } from "@/lib/hooks/queries/useShifts";
import utils from "@/lib/utils";
import { Loader2 } from "lucide-react";

const UpcomingShiftModal = ({
  isOpen,
  onOpenChange,
  setTimeOffOpen,
  setShiftSwapOpen,
  shiftId,
}) => {
  const { data: shift, isLoading } = useGetMyShiftById(shiftId, {
    enabled: isOpen && !!shiftId,
  });

  const name = shift?.referenceId?.title || shift?.referenceId?.name || shift?.referenceId || "-";
  const dateStr = shift?.startDateTime ? utils.formatDateWithName(shift.startDateTime) : "-";
  const startTimeStr = shift?.startDateTime ? utils.formatTime12(shift.startDateTime) : "";
  const endTimeStr = shift?.endDateTime ? utils.formatTime12(shift.endDateTime) : "";
  const timeStr = startTimeStr && endTimeStr ? `${startTimeStr} - ${endTimeStr}` : startTimeStr || "-";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={"max-w-md px-8"}>
        <DialogHeader>
          <div className="flex items-center justify-between w-full border-b-2 ">
            <DialogTitle className="text-[28px] font-bold text-[#181818] pb-2">
              Upcoming Shift
            </DialogTitle>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-950" size={36} />
          </div>
        ) : shift ? (
          <div className="">
            <h4 className="text-[16px] text-[#181818] font-semibold mb-3">
              Shift Details
            </h4>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-[14px] font-medium text-[#737373]">Date</p>
                <p className="text-[14px] font-semibold text-[#181818] mt-1">
                  {dateStr}
                </p>
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#737373]">Time</p>
                <p className="text-[14px] font-semibold text-[#181818] mt-1">
                  {timeStr}
                </p>
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#737373]">Role</p>
                <p className="text-[14px] font-semibold text-[#181818] mt-1">
                  {shift.role || "-"}
                </p>
              </div>
            </div>

            <hr className="border-t-2 mb-4" />

            <div className="mb-4">
              <p className="text-[14px] font-semibold text-[#181818] mb-2">
                Event
              </p>
              <p className="text-[14px] text-[#737373]">
                {name}
              </p>
            </div>

            <hr className="border-t-2 mb-4" />

            <div className="mb-6">
              <p className="text-sm text-[#111827] font-semibold mb-2">
                Any Instruction{" "}
                <span className="text-sm text-[#9CA3AF]">(optional)</span>
              </p>
              <p className="text-[14px] text-[#636363]">
                {shift.instructions || "No instructions provided."}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Failed to load shift details.
          </div>
        )}

        <DialogFooter>
          <div className="flex justify-center gap-4 w-full">
            <Button
              onClick={() => {
                onOpenChange(false);
                setTimeOffOpen(true);
              }}
              className={" py-3 px-4 font-medium "}
              disabled={isLoading}
            >
              Request Time Off
            </Button>

            <Button
              onClick={() => {
                onOpenChange(false);
                setShiftSwapOpen(true);
              }}
              className={" py-3 px-4 font-medium "}
              disabled={isLoading}
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
