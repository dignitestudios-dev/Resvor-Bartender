"use client";
import React, { useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const Profile = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="bg-[#FFFFFF] rounded-[16px] p-6 space-y-4">
      <div className="grid grid-cols-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[24px] text-[#252525] font-[600]">My Profile</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[78px] h-[78px] rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold">
              MS
            </div>
            <p className="text-[20px] text-[#252525] font-[600]">Mike Smith</p>
          </div>
          <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="bg-[#EFEFEF] rounded-[12px] p-4">
              <p className="text-[14px] font-[500] text-[#9E9E9E]">
                Email Address
              </p>
              <p className="text-[16px] text-[#252525]">abc123@gmail.com</p>
            </div>
            <div className="bg-[#EFEFEF] rounded-[12px] p-4">
              <p className="text-[14px] font-[500] text-[#9E9E9E]">
                Phone Number
              </p>
              <p className="text-[16px] text-[#252525]">+123456789</p>
            </div>
          </div>
          <div className="bg-[#EFEFEF] rounded-[12px] p-4">
            <p className="text-[14px] font-[500] text-[#9E9E9E]">Address</p>
            <p className="text-[16px] text-[#252525]">
              456 Maple Street, Anytown, NY 12345
            </p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Profile;
