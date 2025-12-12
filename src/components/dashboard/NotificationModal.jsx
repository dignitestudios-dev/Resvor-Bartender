import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImNotification } from "react-icons/im";
import { useRouter } from "next/navigation";

const NotificationModal = ({ isOpen, onOpenChange }) => {
  const router = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={"w-[440px] px-8"}>
        <DialogHeader>
          <div className="flex items-center justify-between w-full ">
            <DialogTitle className="text-[24px] font-bold text-[#181818] pb-2"></DialogTitle>
          </div>
        </DialogHeader>

        <div className="pt-1">
          <div className="flex justify-center py-6">
            <ImNotification className="text-blue-950" size={100} />
          </div>
          <p className="text-[16px] text-[#202224] text-center mb-1">
            You have important notifications. Please check your inbox for more
            details.
          </p>
        </div>

        <DialogFooter>
          <div className="w-full">
            <Button
              className={"w-full py-4 font-medium rounded-[12px]"}
              onClick={() => {
                router.push("/dashboard/notifications");
                onOpenChange(false);
              }}
            >
              View Notifications
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
