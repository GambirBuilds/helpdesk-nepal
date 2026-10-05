import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { ticketService } from "../services/ticketService.js";
import { authService } from "../services/authService.js";
import { STORAGE_UPDATE_EVENT } from "../services/storage.js";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../data/seedData.js";
import TicketStatusBadge from "../components/common/TicketStatusBadge.jsx";
import PriorityBadge from "../components/common/PriorityBadge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { formatDate, formatNPR } from "../utils/formatters.js";
import {
  Search,
  Filter,
  PlusCircle,
  Download,
  Trash2,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export default function TicketsPage() {
  const { user, isAdmin, isTechnician, isUser } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tickets, setTickets] = useState(() => ticketService.getAll());
  const [technicians, setTechnicians] = useState(() => authService.getTechnicians());

  // Search & Filters State
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [techFilter, setTechFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("All"); // All, MyTickets, Open, Critical, Resolved

  // Delete modal state
  const [deleteTicketId, setDeleteTicketId] = useState(null);

  // Quick assign modal state
  const [assigningTicket, setAssigningTicket] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState("");

  const loadData = () => {
    setTickets(ticketService.getAll());
    setTechnicians(authService.getTechnicians());
  };

  useEffect(() => {
    window.addEventListener(STORAGE_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(STORAGE_UPDATE_EVENT, loadData);
  }, []);

  // Sync search param from URL
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Filter logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Role scoping: if User, default can filter or view, but let user see own or all
      if (activeTab === "MyTickets") {
        if (isUser && t.userId !== user?.id) return false;
        if (isTechnician && t.assignedTechnicianId !== user?.id) return false;
      } else if (activeTab === "Open") {
        if (t.status === "Resolved" || t.status === "Closed") return false;
      } else if (activeTab === "Critical") {
        if (t.priority !== "Critical") return false;
      } else if (activeTab === "Resolved") {
        if (t.status !== "Resolved" && t.status !== "Closed") return false;
      }

      // Dropdown filters
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
      if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
      if (techFilter !== "All" && t.assignedTechnicianId !== techFilter) return false;

      // Text search: ID, subject, requester, tech, device, location
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchId = t.id?.toLowerCase().includes(q);
        const matchSubject = t.subject?.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q);
        const matchUser = t.userName?.toLowerCase().includes(q) || t.userEmail?.toLowerCase().includes(q);
        const matchTech = t.assignedTechnicianName?.toLowerCase().includes(q);
        const matchDevice = t.deviceName?.toLowerCase().includes(q) || t.deviceId?.toLowerCase().includes(q);
        const matchLocation = t.location?.toLowerCase().includes(q);

        if (!matchId && !matchSubject && !matchDesc && !matchUser && !matchTech && !matchDevice && !matchLocation) {
          return false;
        }
      }

      return true;
    });
  }, [
    tickets,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    techFilter,
    activeTab,
    user,
    isUser,
    isTechnician,
  ]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setTechFilter("All");
    setActiveTab("All");
    setSearchParams({});
  };

  const handleDelete = () => {
    if (!deleteTicketId) return;
    ticketService.delete(deleteTicketId);
    showToast(`Ticket ${deleteTicketId} deleted successfully.`, "info");
    setDeleteTicketId(null);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assigningTicket) return;
    const tech = technicians.find((tc) => tc.id === selectedTechId);
    ticketService.update(
      assigningTicket.id,
      {
        assignedTechnicianId: tech ? tech.id : "",
        assignedTechnicianName: tech ? tech.name : "Unassigned",
        status: assigningTicket.status === "Open" && tech ? "Assigned" : assigningTicket.status,
      },
      user
    );
    showToast(`Ticket ${assigningTicket.id} assigned to ${tech ? tech.name : "Unassigned"}.`, "success");
    setAssigningTicket(null);
    setSelectedTechId("");
  };

  const handleExportCSV = () => {
    const headers = [
      "Ticket ID",
      "Subject",
      "Category",
      "Priority",
      "Status",
      "Requester",
      "Technician",
      "Location",
      "Device",
      "Est Cost (NPR)",
      "Created At",
    ];

    const rows = filteredTickets.map((t) => [
      `"${t.id}"`,
      `"${(t.subject || "").replace(/"/g, '""')}"`,
      `"${t.category || ""}"`,
      `"${t.priority || ""}"`,
      `"${t.status || ""}"`,
      `"${(t.userName || "").replace(/"/g, '""')}"`,
      `"${(t.assignedTechnicianName || "").replace(/"/g, '""')}"`,
      `"${(t.location || "").replace(/"/g, '""')}"`,
      `"${(t.deviceName || "").replace(/"/g, '""')}"`,
      t.estimatedCost || 0,
      `"${t.createdAt || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HelpDesk_Nepal_Tickets_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Tickets exported to CSV.", "success");
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            IT Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, assign, and track technical issues reported across Nepal institutions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      {/* Preset View Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-px text-xs font-semibold">
        {[
          { key: "All", label: `All Tickets (${tickets.length})` },
          { key: "Open", label: `Active / In Progress (${tickets.filter((t) => t.status !== "Resolved" && t.status !== "Closed").length})` },
          { key: "Critical", label: `Critical (${tickets.filter((t) => t.priority === "Critical").length})` },
          { key: "Resolved", label: `Resolved (${tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length})` },
          {
            key: "MyTickets",
            label: isTechnician ? "Assigned to Me" : isUser ? "My Reported Tickets" : "My Workload",
          },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket ID, subject, user, device, IP..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
            >
              <option value="All">All Statuses</option>
              {TICKET_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
            >
              <option value="All">All Priorities</option>
              {TICKET_PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
            >
              <option value="All">All Categories</option>
              {TICKET_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Reset */}
        {(searchTerm || statusFilter !== "All" || priorityFilter !== "All" || categoryFilter !== "All" || techFilter !== "All") && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredTickets.length}</strong> of {tickets.length} tickets
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800"
            >
              <RotateCcw className="w-3 h-3" /> Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Tickets Table */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          title="No tickets match your filters"
          description="Try adjusting your search query, status, or category filters to find what you are looking for."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Subject &amp; Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 hidden md:table-cell">Location &amp; Requester</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Technician</th>
                  <th className="py-3 px-4 hidden xl:table-cell">Est. Cost</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* ID & Date */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        {ticket.id}
                      </Link>
                      <span className="block text-[10px] font-normal text-slate-400 font-sans mt-0.5">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </td>

                    {/* Subject & Category */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 block text-xs"
                      >
                        {ticket.subject}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 font-medium text-slate-600">
                          {ticket.category}
                        </span>
                        {ticket.deviceName && (
                          <span className="truncate hidden sm:inline text-slate-400">
                            • {ticket.deviceName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={ticket.priority} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <TicketStatusBadge status={ticket.status} />
                    </td>

                    {/* Location & Requester */}
                    <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{ticket.userName}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-40">
                        {ticket.location}
                      </p>
                    </td>

                    {/* Technician */}
                    <td className="py-3.5 px-4 hidden lg:table-cell whitespace-nowrap">
                      {ticket.assignedTechnicianName && ticket.assignedTechnicianName !== "Unassigned" ? (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="font-medium text-xs">
                            {ticket.assignedTechnicianName}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAssigningTicket(ticket);
                            setSelectedTechId(ticket.assignedTechnicianId || "");
                          }}
                          className="text-[11px] text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 font-semibold"
                        >
                          + Assign
                        </button>
                      )}
                    </td>

                    {/* Est. Cost */}
                    <td className="py-3.5 px-4 hidden xl:table-cell whitespace-nowrap font-mono text-slate-600">
                      {formatNPR(ticket.estimatedCost)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                        >
                          View
                        </Link>

                        {/* Admin or Tech Quick Assign */}
                        {(isAdmin || isTechnician) && (
                          <button
                            type="button"
                            onClick={() => {
                              setAssigningTicket(ticket);
                              setSelectedTechId(ticket.assignedTechnicianId || "");
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title="Assign technician"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete button (Admin only) */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeleteTicketId(ticket.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete ticket"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTicketId)}
        onClose={() => setDeleteTicketId(null)}
        onConfirm={handleDelete}
        title="Delete Support Ticket"
        message={`Are you sure you want to permanently delete ticket ${deleteTicketId}? This action cannot be reversed.`}
        confirmText="Delete Ticket"
        isDestructive={true}
      />

      {/* Assign Technician Modal */}
      {assigningTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setAssigningTicket(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Assign Ticket {assigningTicket.id}
              </h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                {assigningTicket.subject}
              </p>

              <form onSubmit={handleAssignSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Support Technician
                  </label>
                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                  >
                    <option value="">-- Choose Field Technician --</option>
                    {technicians.map((tc) => (
                      <option key={tc.id} value={tc.id}>
                        {tc.name} ({tc.specialty || tc.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAssigningTicket(null)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                  >
                    Save Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
