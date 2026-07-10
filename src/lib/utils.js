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

const utils = {
  formatDateWithName,
  formatTime12,
  capitalize,
};

export default utils;

