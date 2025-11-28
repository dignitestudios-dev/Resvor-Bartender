"use client";
import { navLinks } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import Logo from "../icons/Logo";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import LoggedOut from "../icons/sidebar/LoggedOut";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
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
      <div className="flex items-end mt-[210px]">
        <Button
          type="button"
          onClick={() => router.push("/auth/login")}
          className={
            "bg-white px-3 py-2 text-primary rounded-[12px] text-[12px] hover:bg-slate-100 cursor-pointer"
          }
        >
          <LoggedOut />
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
