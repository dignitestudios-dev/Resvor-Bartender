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
import DatePickerField from "../global/DatePickerField";
import { useGetMyShifts, useGetAllShifts } from "@/lib/hooks/queries/useShifts";
import { useAuthMe } from "@/lib/hooks/queries/useQueries";
import { useRequestShiftSwap } from "@/lib/hooks/mutations/RequestMutations";
import { toast } from "@/components/ui/toaster";
import utils from "@/lib/utils";
import moment from "moment";

const RequestShiftSwapModal = ({ isOpen, onOpenChange, setSuccessModal, defaultShiftId }) => {
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMyShiftId, setSelectedMyShiftId] = useState("");
  const [selectedTargetShiftId, setSelectedTargetShiftId] = useState("");

  const { data: myShiftsRes, isLoading: myShiftsLoading } = useGetMyShifts({ limit: 100 });
  const myShifts = myShiftsRes?.data || [];

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setSelectedTargetShiftId("");

      if (defaultShiftId && myShifts.length > 0) {
        const defShift = myShifts.find((s) => s._id === defaultShiftId);
        if (defShift?.startDateTime) {
          const defDate = new Date(defShift.startDateTime);
          if (moment(defDate).isBefore(moment(), "day")) {
            toast.error("Past shifts cannot be swapped. Please select today or a future date.");
            setSelectedDate(new Date());
            setSelectedMyShiftId("");
          } else {
            setSelectedDate(defDate);
            setSelectedMyShiftId(defaultShiftId);
          }
        } else {
          setSelectedDate(new Date());
          setSelectedMyShiftId(defaultShiftId);
        }
      } else if (!defaultShiftId) {
        setSelectedDate(new Date());
        setSelectedMyShiftId("");
      }
    }
  }, [isOpen, defaultShiftId]);

  useEffect(() => {
    if (isOpen && defaultShiftId && myShifts.length > 0 && !selectedMyShiftId) {
      const defShift = myShifts.find((s) => s._id === defaultShiftId);
      if (defShift?.startDateTime) {
        const defDate = new Date(defShift.startDateTime);
        if (!moment(defDate).isBefore(moment(), "day")) {
          setSelectedDate(defDate);
          setSelectedMyShiftId(defaultShiftId);
        }
      }
    }
  }, [isOpen, defaultShiftId, myShifts]);

  const handleDateChange = (newDate) => {
    if (!newDate) return;
    if (moment(newDate).isBefore(moment(), "day")) {
      toast.error("Past dates are not allowed. Please select today or a future date.");
      return;
    }
    setSelectedDate(newDate);
    setSelectedMyShiftId("");
    setSelectedTargetShiftId("");
  };

  const formattedSelectedDate = selectedDate
    ? moment(selectedDate).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  // Display only shifts scheduled for the selected date (excluding past dates)
  const myShiftsForSelectedDate = myShifts.filter((shift) => {
    if (!shift?.startDateTime) return false;
    const shiftDate = moment(shift.startDateTime).format("YYYY-MM-DD");
    const isPast = moment(shift.startDateTime).isBefore(moment(), "day");
    return shiftDate === formattedSelectedDate && !isPast;
  });

  const selectedMyShift = myShifts.find((s) => s._id === selectedMyShiftId);

  const { data: targetShiftsRes, isLoading: targetShiftsLoading } = useGetAllShifts(
    { limit: 100, date: formattedSelectedDate },
    { enabled: !!formattedSelectedDate }
  );

  const { data: currentUser } = useAuthMe();
  const currentUserId = currentUser?._id || currentUser?.id;

  const getBartenderName = (bartender) => {
    if (!bartender) return "";
    if (typeof bartender === "string") return "";
    return bartender.fullName || `${bartender.firstName || ""} ${bartender.lastName || ""}`.trim() || bartender.name || bartender.email || "";
  };

  const targetShifts = (targetShiftsRes?.data || []).filter((shift) => {
    if (!shift?.startDateTime) return false;
    const shiftDate = moment(shift.startDateTime).format("YYYY-MM-DD");
    const isPast = moment(shift.startDateTime).isBefore(moment(), "day");
    const bartender = shift.bartenderIds?.[0] || shift.bartenderId;
    const bId = bartender && typeof bartender === "object" ? bartender._id : bartender;
    return (
      shiftDate === formattedSelectedDate &&
      !isPast &&
      bId !== currentUserId &&
      shift._id !== selectedMyShiftId
    );
  });

  const { mutate: submitShiftSwap, isPending } = useRequestShiftSwap();

  const formatShiftLabel = (shift) => {
    const startStr = utils.formatTime12(shift.startDateTime);
    const endStr = utils.formatTime12(shift.endDateTime);
    const bartender = shift.bartenderIds?.[0] || shift.bartenderId;
    const bartenderName = getBartenderName(bartender);
    const suffix = bartenderName ? ` - ${bartenderName}` : "";
    return `${utils.formatDateWithName(shift.startDateTime)} (${startStr} - ${endStr}) - ${shift.role || "Bartender"}${suffix}`;
  };

  const handleSubmit = () => {
    if (!selectedDate || moment(selectedDate).isBefore(moment(), "day")) {
      toast.error("Please select today or a future date.");
      return;
    }
    if (!selectedMyShiftId) {
      toast.error("Please select one of your shifts to swap.");
      return;
    }
    if (selectedMyShift && moment(selectedMyShift.startDateTime).isBefore(moment(), "day")) {
      toast.error("Cannot swap past shifts. Please select today or a future shift.");
      return;
    }
    if (!selectedTargetShiftId) {
      toast.error("Please select the target shift to swap with.");
      return;
    }
    const selectedTargetShift = targetShifts.find((s) => s._id === selectedTargetShiftId);
    if (selectedTargetShift && moment(selectedTargetShift.startDateTime).isBefore(moment(), "day")) {
      toast.error("Target shift is in the past.");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    const payload = {
      requestorShiftId: selectedMyShiftId,
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
          {/* Select Date */}
          <DatePickerField
            labelText="Select Date"
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
          />

          {/* Select Your Shift */}
          <div className="flex flex-col gap-1">
            <Label className="text-[14px] text-[#181818] font-[500]">
              Select Your Shift to Swap
            </Label>
            <Select onValueChange={setSelectedMyShiftId} value={selectedMyShiftId}>
              <SelectTrigger className="w-full h-10!">
                <SelectValue placeholder={myShiftsLoading ? "Loading your shifts..." : "Select your shift"} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectGroup>
                  <SelectLabel>Your Shifts</SelectLabel>
                  {myShiftsForSelectedDate.length > 0 ? (
                    myShiftsForSelectedDate.map((shift) => (
                      <SelectItem key={shift._id} value={shift._id}>
                        {formatShiftLabel(shift)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No shifts found for selected date
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Select Target Shift */}
          <div className="flex flex-col gap-1">
            <Label className="text-[14px] text-[#181818] font-[500]">
              Select Shift to Swap With
            </Label>
            <Select
              onValueChange={setSelectedTargetShiftId}
              value={selectedTargetShiftId}
              disabled={targetShiftsLoading}
            >
              <SelectTrigger className="w-full h-10!">
                <SelectValue
                  placeholder={
                    targetShiftsLoading
                      ? "Loading shifts..."
                      : "Select shift"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectGroup>
                  <SelectLabel>Available Shifts</SelectLabel>
                  {targetShifts.length > 0 ? (
                    targetShifts.map((shift) => (
                      <SelectItem key={shift._id} value={shift._id}>
                        {formatShiftLabel(shift)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No shifts found for selected date
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
