import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md">
        The help desk resource or route you requested does not exist or has been moved.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>View Tickets</span>
        </Link>
      </div>
    </div>
  );
}
