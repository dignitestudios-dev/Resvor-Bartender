import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RequestTimeOffModal = ({ isOpen, onOpenChange, setSuccessModal }) => {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={"w-[440px] px-8"}>
        <DialogHeader>
          <div className="flex items-center justify-between w-full border-b-2">
            <DialogTitle className="text-[24px] font-bold text-[#181818] pb-2">
              Request Time Off
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="pt-1">
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

          <div className="mb-2">
            <p className="text-[14px] font-semibold text-[#181818] mb-2">
              Reason For Request
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please Provide a reason for your shift swap request...."
              className="w-full min-h-[96px] border rounded-md p-3 text-sm text-[#4B5563]"
            />
          </div>

          <p className="text-[12px] text-[#202224] mb-1">
            Your request will be sent to your Lounge Manager for review and
            approval. You will be notified once a decision has been made.
          </p>
        </div>

        <DialogFooter>
          <div className="w-full">
            <Button
              className={"w-full py-4 font-medium rounded-[12px]"}
              onClick={() => {
                onOpenChange(false);
                setSuccessModal(true);
              }}
            >
              Submit Request
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestTimeOffModal;
