import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketService } from "../services/ticketService.js";
import { STORAGE_UPDATE_EVENT } from "../services/storage.js";
import TicketStatusBadge from "../components/common/TicketStatusBadge.jsx";
import PriorityBadge from "../components/common/PriorityBadge.jsx";
import { formatTimeAgo, formatNPR } from "../utils/formatters.js";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Users,
  Laptop,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  BarChart2,
  PieChart,
  Layers,
  Sparkles,
  ShieldCheck,
  Network,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isAdmin, isTechnician, isUser } = useAuth();
  const [stats, setStats] = useState(() => ticketService.getStats());
  const [recentTickets, setRecentTickets] = useState(() => ticketService.getAll().slice(0, 5));

  const loadData = () => {
    setStats(ticketService.getStats());
    setRecentTickets(ticketService.getAll().slice(0, 5));
  };

  useEffect(() => {
    window.addEventListener(STORAGE_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(STORAGE_UPDATE_EVENT, loadData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                Nepal ITSM Operations
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                NST (UTC+5:45)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, {user?.name || "Support Officer"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {isAdmin
                ? "Full IT operations view across Kathmandu, Lalitpur, Pokhara, and Chitwan hubs."
                : isTechnician
                ? "Here is your active workload, urgent investigations, and network device status."
                : "Track the status of your reported IT issues or raise a new support ticket."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/tickets/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Ticket</span>
            </Link>
            <Link
              to="/network-tools"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors"
            >
              <Network className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Subnet Calc</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Essential Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total}</span>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              All Time
            </span>
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Open Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-600">{stats.open}</span>
            <span className="text-[11px] text-slate-500 font-medium">Awaiting Action</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{stats.inProgress}</span>
            <span className="text-[11px] text-slate-500 font-medium">Troubleshooting</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Resolved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{stats.resolved}</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {stats.total > 0 ? `${Math.round(((stats.resolved + stats.closed) / stats.total) * 100)}%` : "0%"}
            </span>
          </div>
        </div>

        {/* Critical Tickets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">Critical Incidents</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">{stats.critical}</span>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              High SLA
            </span>
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Avg Resolution</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-700">{stats.avgResolutionHours}h</span>
            <span className="text-[11px] text-slate-500 font-medium">Target: &lt;6h</span>
          </div>
        </div>

        {/* Active Technicians */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Active Techs</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.activeTechnicians}</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
            </span>
          </div>
        </div>

        {/* Registered Devices */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Devices Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.registeredDevices}</span>
            <Link to="/devices" className="text-[11px] font-semibold text-teal-600 hover:underline">
              Inventory &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Ticket Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" /> Monthly Ticket Volume &amp; Resolution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Tickets reported vs resolved over the past 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" /> Created
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Resolved
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-3 sm:gap-6 pt-4 pb-2 border-b border-slate-100">
            {stats.monthlyTrends.map((item, idx) => {
              const maxVal = 32;
              const createdHeight = Math.min(100, Math.round((item.created / maxVal) * 100));
              const resolvedHeight = Math.min(100, Math.round((item.resolved / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Created bar */}
                    <div
                      style={{ height: `${createdHeight}%` }}
                      className="w-3.5 sm:w-5 bg-indigo-600 rounded-t-sm group-hover:bg-indigo-700 transition-all relative flex justify-center"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-[10px] font-bold text-slate-700 transition-opacity">
                        {item.created}
                      </span>
                    </div>

                    {/* Resolved bar */}
                    <div
                      style={{ height: `${resolvedHeight}%` }}
                      className="w-3.5 sm:w-5 bg-emerald-500 rounded-t-sm group-hover:bg-emerald-600 transition-all relative flex justify-center"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-[10px] font-bold text-slate-700 transition-opacity">
                        {item.resolved}
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 text-xs font-semibold text-slate-600">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Tickets by Priority */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-rose-500" /> By Priority Level
              </h3>
              <span className="text-xs text-slate-400 font-mono">Live</span>
            </div>

            <div className="space-y-3.5">
              {[
                { label: "Critical", count: stats.byPriority.Critical || 0, color: "bg-rose-500", text: "text-rose-700" },
                { label: "High", count: stats.byPriority.High || 0, color: "bg-orange-500", text: "text-orange-700" },
                { label: "Medium", count: stats.byPriority.Medium || 0, color: "bg-blue-500", text: "text-blue-700" },
                { label: "Low", count: stats.byPriority.Low || 0, color: "bg-emerald-500", text: "text-emerald-700" },
              ].map((p) => {
                const pct = stats.total > 0 ? Math.round((p.count / stats.total) * 100) : 0;
                return (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span className={p.text}>{p.label}</span>
                      <span className="text-slate-600">{p.count} tickets ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${p.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SLA target compliance</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 94.8% on-time
            </span>
          </div>
        </div>
      </div>

      {/* Categories & Recent Tickets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Categories Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> By Category
            </h3>
            <span className="text-xs text-slate-500">{Object.keys(stats.byCategory).length} active</span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.byCategory).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No categories recorded yet</p>
            ) : (
              Object.entries(stats.byCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([cat, count]) => {
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={cat} className="group">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">{cat}</span>
                        <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full group-hover:bg-indigo-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Recent Tickets Table/List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Support Requests</h3>
              <p className="text-xs text-slate-500">Latest active issues reported across Nepal branches</p>
            </div>
            <Link
              to="/tickets"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTickets.map((t) => (
              <Link
                key={t.id}
                to={`/tickets/${t.id}`}
                className="py-3 px-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-700">
                      {t.id}
                    </span>
                    <PriorityBadge priority={t.priority} />
                    <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
                      • {t.location}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                    {t.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    By {t.userName} ({t.userEmail}) • {formatTimeAgo(t.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <TicketStatusBadge status={t.status} />
                  {t.estimatedCost > 0 && (
                    <span className="text-[10px] font-mono text-slate-500">
                      Est: {formatNPR(t.estimatedCost)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
