"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      {isSuccess ? (
        <CheckCircle2
          size={19}
          className="text-green-600"
        />
      ) : (
        <XCircle
          size={19}
          className="text-red-600"
        />
      )}

      <span className="text-sm font-medium text-gray-800">
        {message}
      </span>

      <button
        type="button"
        onClick={onClose}
        className="ml-2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}