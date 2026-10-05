import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { ticketService } from "../services/ticketService.js";
import { authService } from "../services/authService.js";
import { deviceService } from "../services/deviceService.js";
import { STORAGE_UPDATE_EVENT } from "../services/storage.js";
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
} from "../data/seedData.js";
import TicketStatusBadge from "../components/common/TicketStatusBadge.jsx";
import PriorityBadge from "../components/common/PriorityBadge.jsx";
import Modal from "../components/common/Modal.jsx";
import { formatDate, formatNPR, formatTimeAgo } from "../utils/formatters.js";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  User,
  Wrench,
  CheckCircle2,
  Send,
  Lock,
  MessageSquare,
  AlertTriangle,
  FileText,
  Printer,
  Edit,
  Shield,
  History,
} from "lucide-react";

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isTechnician, isUser } = useAuth();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState(() => ticketService.getById(id));
  const [technicians, setTechnicians] = useState(() => authService.getTechnicians());
  const [device, setDevice] = useState(null);

  // Comment input state
  const [commentText, setCommentText] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Status & Notes Modal / Inline state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [troubleshootingText, setTroubleshootingText] = useState("");
  const [showTroubleshootModal, setShowTroubleshootModal] = useState(false);

  // Reassign Modal
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignTechId, setReassignTechId] = useState("");

  const loadTicket = () => {
    const t = ticketService.getById(id);
    setTicket(t);
    if (t?.deviceId) {
      setDevice(deviceService.getById(t.deviceId));
    }
    setTechnicians(authService.getTechnicians());
  };

  useEffect(() => {
    loadTicket();
    window.addEventListener(STORAGE_UPDATE_EVENT, loadTicket);
    return () => window.removeEventListener(STORAGE_UPDATE_EVENT, loadTicket);
  }, [id]);

  if (!ticket) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Ticket Not Found</h2>
        <p className="text-xs text-slate-500">
          The support ticket with ID <code className="font-mono text-indigo-600">{id}</code> does not exist or has been removed.
        </p>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Ticket List
        </Link>
      </div>
    );
  }

  // Handle posting a comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    ticketService.addComment(
      ticket.id,
      { text: commentText, isInternal: isInternalComment },
      user
    );
    setCommentText("");
    setIsInternalComment(false);
    setIsSubmittingComment(false);
    showToast("Comment posted.", "success");
  };

  // Handle changing status
  const handleUpdateStatusSubmit = (e) => {
    e.preventDefault();
    if (!newStatus) return;

    const updates = {
      status: newStatus,
    };

    if (newStatus === "Resolved") {
      updates.resolutionNotes = statusNote;
    }

    ticketService.update(ticket.id, updates, user);
    showToast(`Ticket status updated to ${newStatus}.`, "success");
    setShowStatusModal(false);
    setStatusNote("");
  };

  // Handle adding troubleshooting notes
  const handleAddTroubleshooting = (e) => {
    e.preventDefault();
    if (!troubleshootingText.trim()) return;

    ticketService.update(
      ticket.id,
      {
        troubleshootingNote: troubleshootingText,
        status: ticket.status === "Open" || ticket.status === "Assigned" ? "In Progress" : ticket.status,
      },
      user
    );
    showToast("Troubleshooting log added to activity history.", "success");
    setShowTroubleshootModal(false);
    setTroubleshootingText("");
  };

  // Handle reassigning technician
  const handleReassignSubmit = (e) => {
    e.preventDefault();
    const tech = technicians.find((tc) => tc.id === reassignTechId);
    ticketService.update(
      ticket.id,
      {
        assignedTechnicianId: tech ? tech.id : "",
        assignedTechnicianName: tech ? tech.name : "Unassigned",
        status: ticket.status === "Open" && tech ? "Assigned" : ticket.status,
      },
      user
    );
    showToast(`Ticket reassigned to ${tech ? tech.name : "Unassigned"}.`, "success");
    setShowReassignModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tickets</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Print button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ticket</span>
          </button>

          {/* Quick status button for Tech / Admin */}
          {(isAdmin || isTechnician) && (
            <>
              <button
                type="button"
                onClick={() => {
                  setNewStatus(ticket.status);
                  setShowStatusModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTroubleshootModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Add Tech Note</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Ticket Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base sm:text-lg font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
              {ticket.id}
            </span>
            <TicketStatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Created {formatDate(ticket.createdAt)}
            </span>
            {ticket.updatedAt && (
              <span className="flex items-center gap-1 hidden sm:inline-flex">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Updated {formatTimeAgo(ticket.updatedAt)}
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {ticket.subject}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
            <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
              Category: {ticket.category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {ticket.location}
            </span>
            {ticket.estimatedCost > 0 && (
              <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Service Cost: {formatNPR(ticket.estimatedCost)}
              </span>
            )}
          </div>
        </div>

        {/* Problem Description */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
          {ticket.description}
        </div>

        {/* Resolution Notes Banner if resolved */}
        {ticket.resolutionNotes && (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs sm:text-sm text-emerald-900 leading-relaxed">
            <div className="flex items-center gap-2 font-bold mb-1 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Official Resolution Report
            </div>
            <p className="whitespace-pre-line">{ticket.resolutionNotes}</p>
          </div>
        )}
      </div>

      {/* Two Column Layout: Details & Device on Right, Timeline & Discussion on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timeline & Comments (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Activity History & Lifecycle Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                Ticket Event Lifecycle &amp; Timeline
              </h3>
              <span className="text-xs text-slate-400">
                {ticket.timeline?.length || 0} events recorded
              </span>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {(ticket.timeline || []).map((event, index) => {
                let dotColor = "bg-indigo-600 ring-indigo-100";
                if (event.type === "created") dotColor = "bg-sky-500 ring-sky-100";
                else if (event.type === "assigned") dotColor = "bg-purple-600 ring-purple-100";
                else if (event.type === "investigation") dotColor = "bg-amber-500 ring-amber-100";
                else if (event.type === "troubleshooting") dotColor = "bg-amber-600 ring-amber-100";
                else if (event.type === "resolved") dotColor = "bg-emerald-600 ring-emerald-100";
                else if (event.type === "closed") dotColor = "bg-slate-700 ring-slate-100";

                return (
                  <div key={event.id || index} className="relative group">
                    {/* Timeline bullet dot */}
                    <span
                      className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ${dotColor}`}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        {event.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      <span>Logged by: <strong className="text-slate-700">{event.author}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Discussion & Comments */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Comments &amp; Troubleshooting Notes
              </h3>
              <span className="text-xs text-slate-400">
                {ticket.comments?.length || 0} messages
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {(!ticket.comments || ticket.comments.length === 0) ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No comments yet. Post an update or ask a question below.
                </p>
              ) : (
                ticket.comments.map((cmt) => {
                  const isInternal = cmt.isInternal;

                  return (
                    <div
                      key={cmt.id}
                      className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                        isInternal
                          ? "bg-amber-50/70 border-amber-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{cmt.author}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                            {cmt.authorRole}
                          </span>
                          {isInternal && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                              <Lock className="w-2.5 h-2.5" /> Internal Tech Note
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {formatTimeAgo(cmt.timestamp)}
                        </span>
                      </div>

                      <p className="text-slate-800 whitespace-pre-line">{cmt.text}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-100 space-y-3 no-print">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Post an Update or Reply
              </label>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your message, diagnostic findings, or feedback here..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {(isAdmin || isTechnician) && (
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalComment}
                      onChange={(e) => setIsInternalComment(e.target.checked)}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Mark as Internal Tech Note (visible to staff only)</span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Requester, Technician & Device specs (1 col) */}
        <div className="space-y-6">
          {/* Stakeholders Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Ticket Stakeholders
            </h3>

            {/* Requester */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Requester / User</p>
              <div className="flex items-center gap-2.5 mt-1.5">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{ticket.userName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{ticket.userEmail}</p>
                </div>
              </div>
            </div>

            {/* Assigned Technician */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Assigned Technician</p>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setReassignTechId(ticket.assignedTechnicianId || "");
                      setShowReassignModal(true);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>

              {ticket.assignedTechnicianName && ticket.assignedTechnicianName !== "Unassigned" ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {ticket.assignedTechnicianName}
                    </p>
                    <p className="text-[11px] text-slate-500">Field IT Specialist</p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                  <span>Currently Unassigned</span>
                  <button
                    type="button"
                    onClick={() => {
                      setReassignTechId("");
                      setShowReassignModal(true);
                    }}
                    className="font-bold text-amber-900 underline"
                  >
                    Assign
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Linked IT Device Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                Linked Device Details
              </h3>
              {device && (
                <Link to="/devices" className="text-[11px] font-semibold text-indigo-600 hover:underline">
                  View All
                </Link>
              )}
            </div>

            {device ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Device Name:</span>
                  <span className="font-bold text-slate-800 text-right">{device.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Device ID:</span>
                  <span className="font-mono font-bold text-indigo-700">{device.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type / Brand:</span>
                  <span className="font-semibold text-slate-700">{device.brand} {device.model} ({device.type})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IP Address:</span>
                  <span className="font-mono font-semibold text-slate-800">{device.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MAC Address:</span>
                  <span className="font-mono text-slate-600">{device.macAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OS / Specs:</span>
                  <span className="text-slate-700 text-right">{device.os}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3 text-center">
                {ticket.deviceName ? (
                  <p className="font-semibold text-slate-700">{ticket.deviceName}</p>
                ) : (
                  "No specific asset linked to this ticket."
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={`Update Status: ${ticket.id}`}
      >
        <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select New Ticket Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              {TICKET_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {newStatus === "Resolved" && (
            <div>
              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                Resolution Notes / Root Cause Findings <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                required
                placeholder="Explain the technical resolution, replaced parts, firmware updates, or instructions provided to the user..."
                className="w-full px-3 py-2 text-xs bg-emerald-50/50 border border-emerald-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Confirm Status
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Troubleshooting Log Modal */}
      <Modal
        isOpen={showTroubleshootModal}
        onClose={() => setShowTroubleshootModal(false)}
        title={`Add Troubleshooting Action: ${ticket.id}`}
      >
        <form onSubmit={handleAddTroubleshooting} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Action Taken / Test Performed
            </label>
            <textarea
              rows={4}
              value={troubleshootingText}
              onChange={(e) => setTroubleshootingText(e.target.value)}
              required
              placeholder="e.g. Flushed DNS resolver cache on workstation, tested ping to default gateway 192.168.1.1, replaced crimped RJ-45 plug with tester-verified CAT6 termination..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowTroubleshootModal(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              Log to Timeline
            </button>
          </div>
        </form>
      </Modal>

      {/* Reassign Technician Modal */}
      <Modal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title={`Reassign Ticket: ${ticket.id}`}
      >
        <form onSubmit={handleReassignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Field Support Technician
            </label>
            <select
              value={reassignTechId}
              onChange={(e) => setReassignTechId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option value="">-- Unassigned --</option>
              {technicians.map((tc) => (
                <option key={tc.id} value={tc.id}>
                  {tc.name} ({tc.specialty || tc.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowReassignModal(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Save Reassignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
