"use client";
import { navLinks } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import Logo from "../icons/Logo";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  console.log("pathname: ", pathname);
  return (
    <nav className="h-full bg-[url(/bg-image.png)] bg-cover bg-center min-w-[227px] w-fit rounded-3xl p-5 overflow-y-auto hidden-scrollbar">
      <Logo />
      <ul className="mt-7 space-y-4">
        {navLinks.map((link, index) => {
          const isActive = pathname === link.path; // active link check
          return (
            <li key={index}>
              <Link
                href={link.path}
                className={`flex items-center gap-2 py-2 px-5 rounded-xl ${
                  isActive ? "text-primary bg-white" : "text-white"
                }`}
              >
                {isActive ? link.selectedIcon : link.icon}
                <span>{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-1/3 flex items-end">
        <Button
          className={
            "bg-white px-3 py-2 text-primary rounded-[12px] text-[12px] hover:bg-slate-100 cursor-pointer"
          }
        >
          <LogOut className="mr-2 h-4 w-4 " />
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
