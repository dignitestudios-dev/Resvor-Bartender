import Sidebar from "@/components/global/Sidebar";
import Navbar from "@/components/global/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full flex gap-4 h-screen">
      <div className="py-6 pl-6">
        <Sidebar />
      </div>
      <div className="py-6 pr-6 flex flex-col flex-1 h-full overflow-hidden">
        <Navbar />
        <div className="w-full flex-1 flex flex-col gap-5 overflow-y-auto p-4 rounded-[10px]">
          {children}
        </div>
      </div>
    </div>
  );
}
