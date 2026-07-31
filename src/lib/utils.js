import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDateWithName = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const formatTime12 = (isoString) => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const pad = (num) => String(num).padStart(2, "0");
  const hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const hours12 = pad(hours % 12 || 12);
  const ampm = hours >= 12 ? "PM" : "AM";

  return `${hours12}:${minutes} ${ampm}`;
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const phoneToE164 = (formattedPhone, countryCode = "+1") => {
  const digits = formattedPhone.replace(/\D/g, ""); // Strip all non-numeric chars
  // Remove leading 0 if present (e.g. 03001234567 → 3001234567)
  const normalized = digits.startsWith("0") ? digits.slice(1) : digits;
  return `${countryCode}${normalized}`;
};

export const getNormalizedStatus = (status) => {
  if (!status || typeof status !== "string") return "-";
  const s = status.toLowerCase().trim();
  if (s === "completed" || s === "complete") return "Completed";
  if (s === "confirmed" || s === "confirm") return "Confirmed";
  if (s === "expired" || s === "expire") return "Expired";
  if (s === "rejected" || s === "reject") return "Rejected";
  if (s === "approved" || s === "approve") return "Approved";
  if (s === "published" || s === "publish") return "Published";
  if (s === "cancelled" || s === "canceled" || s === "cancel") return "Cancelled";
  if (s === "upcoming") return "Upcoming";
  if (s === "pending") return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export const getStatusColorHex = (status) => {
  if (!status || typeof status !== "string") return "#6B7280";
  const s = status.toLowerCase().trim();
  switch (s) {
    case "completed":
    case "complete":
      return "#22C55E";
    case "confirmed":
    case "confirm":
      return "#3B82F6";
    case "expired":
    case "expire":
      return "#6B7280";
    case "rejected":
    case "reject":
      return "#EF4444";
    case "approved":
    case "approve":
      return "#10B981";
    case "published":
    case "publish":
      return "#6366F1";
    case "cancelled":
    case "canceled":
    case "cancel":
      return "#DC2626";
    case "upcoming":
      return "#8B5CF6";
    case "pending":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

const utils = {
  formatDateWithName,
  formatTime12,
  capitalize,
  phoneToE164,
  getNormalizedStatus,
  getStatusColorHex,
};

export default utils;

