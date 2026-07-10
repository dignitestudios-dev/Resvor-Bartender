"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

type ToastListener = (toast: Omit<Toast, "id">) => void;

const toastListeners = new Set<ToastListener>();

export const toast = {
  error: (message: string) => {
    toastListeners.forEach((listener) => listener({ type: "error", message }));
  },
  success: (message: string) => {
    toastListeners.forEach((listener) => listener({ type: "success", message }));
  },
};

export const ErrorToast = (message: string) => {
  toast.error(message);
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = ({ type, message }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    toastListeners.add(handleToast);
    return () => {
      toastListeners.delete(handleToast);
    };
  }, []);

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            t.type === "error"
              ? "bg-red-500/90 border-red-600/50 text-white"
              : "bg-emerald-600/90 border-emerald-700/50 text-white"
          }`}
        >
          {t.type === "error" ? (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm font-medium leading-relaxed">
            {t.message}
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="text-white/80 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/10"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
