import React from "react";
import { AlertCircle, Flame, ArrowUp, ArrowDown, Minus } from "lucide-react";

export default function PriorityBadge({ priority, className = "" }) {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let Icon = Minus;

  switch (priority) {
    case "Critical":
      badgeStyle = "bg-rose-50 text-rose-700 border-rose-300 font-bold animate-pulse";
      Icon = Flame;
      break;
    case "High":
      badgeStyle = "bg-orange-50 text-orange-700 border-orange-200 font-semibold";
      Icon = ArrowUp;
      break;
    case "Medium":
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200 font-medium";
      Icon = Minus;
      break;
    case "Low":
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200 font-normal";
      Icon = ArrowDown;
      break;
    default:
      badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs border ${badgeStyle} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{priority || "Normal"}</span>
    </span>
  );
}
