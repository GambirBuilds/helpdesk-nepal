import React from "react";
import { CircleDot, Clock, CheckCircle2, AlertCircle, CheckCheck, UserCheck } from "lucide-react";

export default function TicketStatusBadge({ status, className = "" }) {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let Icon = CircleDot;

  switch (status) {
    case "Open":
      badgeStyle = "bg-sky-50 text-sky-700 border-sky-200";
      Icon = CircleDot;
      break;
    case "Assigned":
      badgeStyle = "bg-indigo-50 text-indigo-700 border-indigo-200";
      Icon = UserCheck;
      break;
    case "In Progress":
      badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
      Icon = Clock;
      break;
    case "Waiting for User":
      badgeStyle = "bg-orange-50 text-orange-800 border-orange-200";
      Icon = AlertCircle;
      break;
    case "Resolved":
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
      Icon = CheckCircle2;
      break;
    case "Closed":
      badgeStyle = "bg-slate-100 text-slate-600 border-slate-200";
      Icon = CheckCheck;
      break;
    default:
      badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${badgeStyle} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{status || "Unknown"}</span>
    </span>
  );
}
