import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DatePickerField from "../global/DatePickerField";
import { useRequestTimeOff } from "@/lib/hooks/mutations/RequestMutations";
import { toast } from "@/components/ui/toaster";
import moment from "moment";

const RequestTimeOffModal = ({ isOpen, onOpenChange, setSuccessModal, defaultDate }) => {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setDate(defaultDate ? new Date(defaultDate) : null);
      setReason("");
    }
  }, [isOpen, defaultDate]);

  const { mutate: submitTimeOff, isPending } = useRequestTimeOff();

  const handleSubmit = () => {
    if (!date) {
      toast.error("Please select a date.");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    const payload = {
      date: moment(date).format("YYYY-MM-DD"),
      reason: reason.trim(),
    };

    submitTimeOff(payload, {
      onSuccess: () => {
        onOpenChange(false);
        setSuccessModal(true);
      },
      onError: (err) => {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to submit time off request.";
        toast.error(errorMsg);
      },
    });
  };

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
          <div className="mb-4">
            <DatePickerField
              labelText="Select Date"
              label="Select Date"
              value={date}
              onChange={setDate}
              minDate={new Date()}
            />
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
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestTimeOffModal;

