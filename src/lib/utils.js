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

const utils = {
  formatDateWithName,
  formatTime12,
  capitalize,
  phoneToE164,
};

export default utils;

