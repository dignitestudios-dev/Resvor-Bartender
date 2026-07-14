"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutConfirmModal = ({ isOpen, onOpenChange, onConfirm, isLoading }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[420px] rounded-[22px] py-8 px-8">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 pt-2">
            <div className="h-20 w-20 rounded-full bg-red-50 border-2 border-red-100 flex justify-center items-center">
              <LogOut className="text-red-500" size={36} />
            </div>
            <DialogTitle className="text-[22px] font-bold text-[#181818] text-center">
              Logout Confirmation
            </DialogTitle>
            <p className="text-[15px] text-[#565656] text-center leading-relaxed">
              Are you sure you want to logout? You will need to sign in again to
              access your account.
            </p>
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-5 rounded-[12px] border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 py-5 rounded-[12px] bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Yes, Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmModal;
