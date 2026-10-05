import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = "md", label = "Loading data..." }) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500 gap-2">
      <Loader2 className={`animate-spin text-indigo-600 ${sizeMap[size] || sizeMap.md}`} />
      {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
    </div>
  );
}
