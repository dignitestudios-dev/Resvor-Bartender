"use client";
import Link from "next/link";
import React from "react";
import { useAuthMe } from "../../lib/hooks/queries/useQueries";

const Navbar = () => {
  const { data: user } = useAuthMe();

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
    <div className="rounded-3xl w-full bg-white p-4 flex justify-end">
      <Link href="/dashboard/profile">
        <div className="flex items-center gap-2 ">
          {user?.profileImage?.location ? (
            <img
              src={user.profileImage.location}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold">
              {initials}
            </div>
          )}
          <h2 className="text-[13px] font-medium text-gray-900">
            {name}
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
