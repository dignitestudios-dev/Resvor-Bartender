import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMyShifts, useGetSwappableShifts } from "@/lib/hooks/queries/useShifts";
import { useRequestShiftSwap } from "@/lib/hooks/mutations/RequestMutations";
import { toast } from "@/components/ui/toaster";
import utils from "@/lib/utils";
import moment from "moment";

const RequestShiftSwapModal = ({ isOpen, onOpenChange, setSuccessModal, defaultShiftId }) => {
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMyShiftId, setSelectedMyShiftId] = useState("");
  const [selectedTargetShiftId, setSelectedTargetShiftId] = useState("");

  const reqId = defaultShiftId || selectedMyShiftId;

  const { data: myShiftsRes } = useGetMyShifts({ limit: 100 }, { enabled: isOpen });
  const myShifts = myShiftsRes?.data || [];

  const { data: swappableRes, isLoading: swappableLoading } = useGetSwappableShifts(reqId, {
    enabled: isOpen && !!reqId,
  });

  const availableShifts = Array.isArray(swappableRes)
    ? swappableRes
    : swappableRes?.data || [];

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setSelectedTargetShiftId("");

      const currentReqId = defaultShiftId || selectedMyShiftId;
      if (currentReqId && myShifts.length > 0) {
        const defShift = myShifts.find((s) => s._id === currentReqId);
        if (defShift?.startDateTime) {
          const defDate = new Date(defShift.startDateTime);
          if (moment(defDate).isBefore(moment(), "day")) {
            toast.error("Past shifts cannot be swapped.");
            setSelectedDate(new Date());
            setSelectedMyShiftId("");
          } else {
            setSelectedDate(defDate);
            setSelectedMyShiftId(currentReqId);
          }
        } else {
          setSelectedDate(new Date());
          setSelectedMyShiftId(currentReqId);
        }
      } else if (!currentReqId) {
        setSelectedDate(new Date());
        setSelectedMyShiftId("");
      }
    }
  }, [isOpen, defaultShiftId, myShifts]);

  const { mutate: submitShiftSwap, isPending } = useRequestShiftSwap();

  const getBartenderName = (bartender) => {
    if (!bartender) return "";
    if (typeof bartender === "string") return "";
    return (
      bartender.fullName ||
      `${bartender.firstName || ""} ${bartender.lastName || ""}`.trim() ||
      bartender.name ||
      bartender.email ||
      ""
    );
  };

  const formatShiftLabel = (shift) => {
    const startStr = utils.formatTime12(shift.startDateTime);
    const endStr = utils.formatTime12(shift.endDateTime);
    const bartender = shift.bartenderIds?.[0] || shift.bartenderId;
    const bartenderName = getBartenderName(bartender);
    const suffix = bartenderName ? ` - ${bartenderName}` : "";
    return `${utils.formatDateWithName(shift.startDateTime)} (${startStr} - ${endStr}) - ${shift.role || "Bartender"}${suffix}`;
  };

  const handleSubmit = () => {
    const requestorShiftId = defaultShiftId || selectedMyShiftId;
    if (!requestorShiftId) {
      toast.error("No shift selected for request.");
      return;
    }
    if (!selectedTargetShiftId) {
      toast.error("Please select a target shift to swap with.");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    const payload = {
      requestorShiftId,
      targetShiftId: selectedTargetShiftId,
      reason: reason.trim(),
    };

    submitShiftSwap(payload, {
      onSuccess: () => {
        onOpenChange(false);
        setSuccessModal(true);
      },
      onError: (err) => {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to submit shift swap request.";
        toast.error(errorMsg);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={""}>
        <DialogHeader>
          <div className="flex items-center justify-between w-full border-b-2">
            <DialogTitle className="text-[24px] font-bold text-[#181818] pb-2">
              Request Shift Swap
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex relative flex-col gap-4 mt-2">
          {/* Static Date */}
          <div className="flex flex-col gap-1">
            <Label className="text-[14px] text-[#181818] font-[500]">
              Date
            </Label>
            <div className="w-full border rounded-md p-3 text-sm text-[#4B5563] bg-gray-50 font-medium">
              {selectedDate ? moment(selectedDate).format("DD MMM, YYYY") : "-"}
            </div>
          </div>

          {/* Select Shift to Swap With (Target Shift) */}
          <div className="flex flex-col gap-1">
            <Label className="text-[14px] text-[#181818] font-[500]">
              Select Shift to Swap With
            </Label>
            <Select onValueChange={setSelectedTargetShiftId} value={selectedTargetShiftId}>
              <SelectTrigger className="w-full h-10!">
                <SelectValue placeholder={swappableLoading ? "Loading shifts..." : "Select shift"} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectGroup>
                  <SelectLabel>Available Shifts</SelectLabel>
                  {availableShifts.length > 0 ? (
                    availableShifts.map((shift) => (
                      <SelectItem key={shift._id} value={shift._id}>
                        {formatShiftLabel(shift)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No shifts found
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div>
            <Label className="text-[14px] font-semibold text-[#181818] mb-2 block">
              Reason For Request
            </Label>
            <textarea
              value={reason}
              maxLength={250}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please Provide a reason for your shift swap request...."
              className="w-full min-h-[96px] border rounded-[15px] p-3 text-sm text-[#4B5563]"
            />
          </div>

          <p className="text-[12px] text-[#202224]">
            Your request will be sent to your Lounge Manager for review and
            approval. You will be notified once a decision has been made.
          </p>
        </div>

        <DialogFooter>
          <div className="w-full mt-4">
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

export default RequestShiftSwapModal;
