import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="rounded-3xl w-full bg-white p-4 flex justify-end">
      <Link href="/dashboard/profile">
        <div className="flex items-center gap-2 ">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold">
            PR
          </div>
          <h2 className="text-[13px] font-medium text-gray-900">
            Peter Parker
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
