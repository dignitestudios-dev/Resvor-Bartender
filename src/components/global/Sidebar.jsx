"use client";
import { navLinks } from "@/lib/constants";
import Link from "next/link";
import React, { useState } from "react";
import Logo from "../icons/Logo";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import LoggedOut from "../icons/sidebar/LoggedOut";
import { useRouter } from "next/navigation";
import { useLogout } from "@/lib/hooks/mutations/AuthMutations";
import LogoutConfirmModal from "./LogoutConfirmModal";
import Cookies from "js-cookie";
import { ErrorToast } from "../ui/toaster";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logoutMutation = useLogout();

  console.log("pathname: ", pathname);

  const handleLogoutConfirm = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Cookies are cleared by the axios interceptor on /auth/logout response
      // but we also clear manually here as fallback
      Cookies.remove("token", { path: "/" });
      Cookies.remove("authorization", { path: "/" });
      Cookies.remove("sessionType", { path: "/" });
      Cookies.remove("onboardingStep", { path: "/" });
      Cookies.remove("user", { path: "/" });
      setShowLogoutModal(false);
      router.push("/auth/login");
    } catch (error) {
      // Even on error, clear cookies and redirect to keep UX smooth
      Cookies.remove("token", { path: "/" });
      Cookies.remove("authorization", { path: "/" });
      Cookies.remove("sessionType", { path: "/" });
      Cookies.remove("onboardingStep", { path: "/" });
      Cookies.remove("user", { path: "/" });
      setShowLogoutModal(false);
      router.push("/auth/login");
    }
  };

  return (
    <>
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogoutConfirm}
        isLoading={logoutMutation.isPending}
      />

      <nav className="h-full bg-[url(/bg-image.png)] bg-cover bg-center min-w-[227px] w-fit rounded-3xl p-5 overflow-y-auto hidden-scrollbar">
        <Logo />
        <ul className="mt-7 space-y-4">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.path;
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
            onClick={() => setShowLogoutModal(true)}
            className={
              "bg-white px-3 py-2 text-primary rounded-[12px] text-[12px] hover:bg-slate-100 cursor-pointer"
            }
          >
            <LoggedOut />
            Logout
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
