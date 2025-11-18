import React from "react";
import { IoCheckmark } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

const SuccessModal = ({ isOpen, onOpenChange, title, content }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={"rounded-[22px] w-[500px] py-10"}>
        <DialogHeader>
          <DialogDescription>
            <div className="flex flex-col justify-center items-center gap-3 space-y-2">
              <div className="h-32 w-32 rounded-full bg-gradient flex justify-center items-center">
                <IoCheckmark className="text-white" size={70} />
              </div>
              <h3 className="text-[#181818] text-[32px] font-semibold text-center">
                {title}
              </h3>
              <p className="text-[#565656] text-[16px] text-center">
                {content}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
