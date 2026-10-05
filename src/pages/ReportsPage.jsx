import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketService } from "../services/ticketService.js";
import { deviceService } from "../services/deviceService.js";
import { authService } from "../services/authService.js";
import { formatNPR, formatDateOnly } from "../utils/formatters.js";
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HardDrive,
  Users,
  Shield,
  FileSpreadsheet,
} from "lucide-react";

export default function ReportsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("all"); // 7days, 30days, quarter, all

  const allTickets = ticketService.getAll();
  const allDevices = deviceService.getAll();
  const allTechs = authService.getTechnicians();

  // Filter tickets by date range
  const filteredTickets = useMemo(() => {
    if (dateRange === "all") return allTickets;
    const now = new Date().getTime();
    let days = 30;
    if (dateRange === "7days") days = 7;
    if (dateRange === "30days") days = 30;
    if (dateRange === "quarter") days = 90;

    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return allTickets.filter((t) => new Date(t.createdAt).getTime() >= cutoff);
  }, [allTickets, dateRange]);

  // Derived metrics
  const total = filteredTickets.length;
  const resolved = filteredTickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
  const unresolved = total - resolved;
  const critical = filteredTickets.filter((t) => t.priority === "Critical").length;
  const totalServiceCost = filteredTickets.reduce((acc, t) => acc + (Number(t.estimatedCost) || 0), 0);

  // Group by Category
  const byCategory = useMemo(() => {
    const map = {};
    filteredTickets.forEach((t) => {
      const c = t.category || "Other";
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredTickets]);

  // Group by Priority
  const byPriority = useMemo(() => {
    return {
      Critical: filteredTickets.filter((t) => t.priority === "Critical").length,
      High: filteredTickets.filter((t) => t.priority === "High").length,
      Medium: filteredTickets.filter((t) => t.priority === "Medium").length,
      Low: filteredTickets.filter((t) => t.priority === "Low").length,
    };
  }, [filteredTickets]);

  // Group by Technician
  const techStats = useMemo(() => {
    return allTechs.map((tech) => {
      const assigned = filteredTickets.filter((t) => t.assignedTechnicianId === tech.id);
      const resCount = assigned.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
      return {
        name: tech.name,
        specialty: tech.specialty || tech.department,
        totalAssigned: assigned.length,
        resolved: resCount,
        open: assigned.length - resCount,
        rate: assigned.length > 0 ? Math.round((resCount / assigned.length) * 100) : 100,
      };
    });
  }, [allTechs, filteredTickets]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            IT Operations &amp; SLA Performance Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit compliance, incident resolution rates, and hardware expenditure in Nepal
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date range filter */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 shadow-xs focus:outline-hidden"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="quarter">This Quarter (90 Days)</option>
              <option value="all">All-Time Cumulative</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
        {/* Report Official Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-lg text-slate-900">
                HelpDesk <span className="text-rose-600">Nepal</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                Official Audit
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Department of Information Technology &amp; Campus Infrastructure
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5 font-mono">
            <p>Generated: <strong>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</strong></p>
            <p>Prepared by: <strong>{user?.name}</strong> ({user?.role})</p>
            <p>Period: <strong className="capitalize">{dateRange === "all" ? "Full History" : dateRange}</strong></p>
          </div>
        </div>

        {/* 4 Summary Scorecards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print-break-inside-avoid">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
              Total Recorded Incidents
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{total}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block mb-1">
              Resolved &amp; Closed
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-emerald-700">{resolved}</span>
              <span className="text-xs font-bold text-emerald-800">
                {total > 0 ? `${Math.round((resolved / total) * 100)}%` : "0%"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 uppercase block mb-1">
              Active Unresolved
            </span>
            <span className="text-2xl font-extrabold text-amber-700">{unresolved}</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 uppercase block mb-1">
              Critical Outages
            </span>
            <span className="text-2xl font-extrabold text-rose-700">{critical}</span>
          </div>
        </div>

        {/* Financial & Asset Overview in NPR */}
        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print-break-inside-avoid">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 mb-0.5">
              Estimated IT Repair &amp; Service Expenditure
            </h4>
            <p className="text-xs text-indigo-800">
              Total estimated component replacement and contractor service charges across reported incidents
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-950">
              {formatNPR(totalServiceCost)}
            </span>
            <span className="block text-[10px] text-indigo-600 font-medium">Nepalese Rupees</span>
          </div>
        </div>

        {/* Section 1: Breakdown by Category & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-break-inside-avoid">
          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Incidents by Technical Category
            </h3>
            <div className="space-y-2">
              {byCategory.map(([cat, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat}</span>
                      <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priorities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Incidents by Priority SLA Level
            </h3>
            <div className="space-y-2.5">
              {[
                { label: "Critical Priority", count: byPriority.Critical, color: "bg-rose-500" },
                { label: "High Priority", count: byPriority.High, color: "bg-orange-500" },
                { label: "Medium Priority", count: byPriority.Medium, color: "bg-blue-500" },
                { label: "Low Priority", count: byPriority.Low, color: "bg-emerald-500" },
              ].map((p) => {
                const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
                return (
                  <div key={p.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{p.label}</span>
                      <span className="font-mono text-slate-500">{p.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`${p.color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Field Technician Performance Table */}
        <div className="space-y-3 print-break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Technician Resolution &amp; Workload Metrics
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Technician</th>
                  <th className="py-2.5 px-3">Specialty</th>
                  <th className="py-2.5 px-3 text-center">Assigned</th>
                  <th className="py-2.5 px-3 text-center">Resolved</th>
                  <th className="py-2.5 px-3 text-center">Open</th>
                  <th className="py-2.5 px-3 text-right">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {techStats.map((st) => (
                  <tr key={st.name} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{st.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{st.specialty}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">{st.totalAssigned}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{st.resolved}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-600">{st.open}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">{st.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Device Hardware Fleet Summary */}
        <div className="space-y-3 print-break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Campus IT Asset Fleet Overview ({allDevices.length} Total Devices)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Desktops / Laptops</span>
              <span className="font-extrabold text-base text-slate-800">
                {allDevices.filter((d) => d.type === "Desktop" || d.type === "Laptop").length} units
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Printers &amp; MFPs</span>
              <span className="font-extrabold text-base text-slate-800">
                {allDevices.filter((d) => d.type === "Printer").length} units
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Switches &amp; Routers</span>
              <span className="font-extrabold text-base text-slate-800">
                {allDevices.filter((d) => d.type === "Switch" || d.type === "Router").length} units
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Servers &amp; Access Points</span>
              <span className="font-extrabold text-base text-slate-800">
                {allDevices.filter((d) => d.type === "Server" || d.type === "Access Point").length} units
              </span>
            </div>
          </div>
        </div>

        {/* Sign-off footer */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-400">
          <div>
            <p className="font-bold text-slate-700">HelpDesk Nepal ITSM Management System</p>
            <p>Certified IT operations log for higher education and enterprise audits.</p>
          </div>
          <div className="text-right">
            <div className="w-36 border-b border-slate-400 mb-1" />
            <p className="font-semibold text-slate-600">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
