"use client";
import React, { useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import { useAuthMe } from "../../../lib/hooks/queries/useQueries";

const Profile = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: user, isLoading } = useAuthMe();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  const name =
    user?.fullName ||
    user?.name ||
    (user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : "") ||
    "Bartender";

  const getInitials = (nameString) => {
    if (!nameString) return "B";
    const parts = nameString.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="bg-[#FFFFFF] rounded-[16px] p-6 space-y-4">
      <div className="grid grid-cols-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[24px] text-[#252525] font-[600]">My Profile</p>
          </div>
          <div className="flex items-center gap-2">
            {user?.profileImage?.location ? (
              <img
                src={user.profileImage.location}
                alt={name}
                className="w-[78px] h-[78px] rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-[78px] h-[78px] rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
            )}
            <p className="text-[20px] text-[#252525] font-[600]">{name}</p>
          </div>
          <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="bg-[#EFEFEF] rounded-[12px] p-4">
              <p className="text-[14px] font-[500] text-[#9E9E9E]">
                Email Address
              </p>
              <p className="text-[16px] text-[#252525]">{user?.email || "N/A"}</p>
            </div>
            <div className="bg-[#EFEFEF] rounded-[12px] p-4">
              <p className="text-[14px] font-[500] text-[#9E9E9E]">
                Phone Number
              </p>
              <p className="text-[16px] text-[#252525]">
                {user?.phoneNumber || user?.phone || "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-[#EFEFEF] rounded-[12px] p-4">
            <p className="text-[14px] font-[500] text-[#9E9E9E]">Address</p>
            <p className="text-[16px] text-[#252525]">
              {user?.address || "N/A"}
            </p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Profile;
