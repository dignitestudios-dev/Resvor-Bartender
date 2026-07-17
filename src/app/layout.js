import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import OfflineStatusDetector from "@/components/global/OfflineStatusDetector";

import ReactQueryProvider from "@/lib/hooks/query/ReactQueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Work Force Management",
  description: "Work force dashboard",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[#F4F4FF] overflow-x-hidden`}
      >
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster />
        <OfflineStatusDetector />
      </body>
    </html>
  );
}

