// src/components/Common/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({
  size = "medium",
  text = "Đang tải...",
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`${sizeClasses[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-2`}
      ></div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}
