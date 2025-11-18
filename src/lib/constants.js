import BartendersRequests from "@/components/icons/sidebar/bartenders-requests";
import Bookings from "@/components/icons/sidebar/bookings";
import Chat from "@/components/icons/sidebar/chat";
import Dashboard from "@/components/icons/sidebar/dashboard";
import EventManagement from "@/components/icons/sidebar/event-management";
import Shift from "@/components/icons/sidebar/shift";
import Notifications from "@/components/icons/sidebar/notifications";

export const navLinks = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <Dashboard />,
    selectedIcon: <Dashboard color="#010053" />,
  },
  {
    name: "Shifts",
    path: "/dashboard/shift",
    icon: <Shift />,
    selectedIcon: <Shift color="#010053" />,
  },
  {
    name: "Requests",
    path: "/dashboard/requests",
    icon: <BartendersRequests />,
    selectedIcon: <BartendersRequests color="#010053" />,
  },
  {
    name: "Chat With Manager",
    path: "/dashboard/chat",
    icon: <Chat />,
    selectedIcon: <Chat color="#010053" />,
  },
  {
    name: "Notifications",
    path: "/dashboard/notifications",
    icon: <Notifications />,
    selectedIcon: <Notifications color="#010053" />,
  },
];

// Mock Data
export const dashboardStats = [
  {
    title: "Upcoming Shifts",
    value: 10,
    icon: <Bookings size={28} />,
  },
  {
    title: "Pending Requests",
    value: 18,
    icon: <EventManagement size={28} />,
  },
  {
    title: "Unread Messages",
    value: 9,
    icon: <Chat size={28} />,
  },
];

export const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
