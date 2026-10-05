import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { ticketService } from "../services/ticketService.js";
import { deviceService } from "../services/deviceService.js";
import { authService } from "../services/authService.js";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  NEPAL_LOCATIONS,
} from "../data/seedData.js";
import { generateTicketId } from "../utils/formatters.js";
import {
  PlusCircle,
  ArrowLeft,
  Ticket,
  Laptop,
  AlertCircle,
  MapPin,
  CheckCircle,
  Banknote,
  Send,
} from "lucide-react";

export default function NewTicketPage() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [devices, setDevices] = useState(() => deviceService.getAll());
  const [technicians, setTechnicians] = useState(() => authService.getTechnicians());
  const [existingTickets] = useState(() => ticketService.getAll());

  // Form state
  const [previewId] = useState(() => generateTicketId(existingTickets));
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Network");
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState(user?.location || "Kathmandu (Maitighar)");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [assignedTechnicianId, setAssignedTechnicianId] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDevices(deviceService.getAll());
    setTechnicians(authService.getTechnicians());
  }, []);

  const validate = () => {
    const errs = {};
    if (!subject.trim()) {
      errs.subject = "Please enter a descriptive subject for the IT issue.";
    } else if (subject.trim().length < 5) {
      errs.subject = "Subject must be at least 5 characters long.";
    }

    if (!description.trim()) {
      errs.description = "Please describe the problem symptoms and error messages.";
    } else if (description.trim().length < 15) {
      errs.description = "Please provide more details (at least 15 characters).";
    }

    if (!location.trim()) {
      errs.location = "Please select or enter the issue location in Nepal.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const linkedDevice = devices.find((d) => d.id === selectedDeviceId);
    const assignedTech = technicians.find((tc) => tc.id === assignedTechnicianId);

    const newTicketData = {
      subject,
      description,
      category,
      priority,
      location,
      deviceId: linkedDevice ? linkedDevice.id : "",
      deviceName: linkedDevice ? `${linkedDevice.name} (${linkedDevice.model})` : "",
      assignedTechnicianId: assignedTech ? assignedTech.id : "",
      assignedTechnicianName: assignedTech ? assignedTech.name : "Unassigned",
      estimatedCost: estimatedCost ? Number(estimatedCost) : 0,
    };

    try {
      const created = ticketService.create(newTicketData, user);
      showToast(`Support Ticket ${created.id} created successfully!`, "success");
      navigate(`/tickets/${created.id}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to create ticket. Please check inputs.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tickets</span>
        </Link>

        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
          Target ID: {previewId}
        </span>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            Create IT Support Ticket
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Report an IT hardware, software, network, printer, or access incident for institutional resolution
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ticket Subject / Issue Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Subnet 192.168.10.0 Gateway Unreachable in Maitighar Lab 3"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                errors.subject
                  ? "border-rose-300 focus:ring-rose-200 text-rose-900"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              }`}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.subject}</p>
            )}
          </div>

          {/* Row 1: Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              >
                {TICKET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              >
                {TICKET_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p} {p === "Critical" ? "(Urgent Campus Outage)" : p === "High" ? "(Work Blocking)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Location (Nepal) & Linked Device */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location in Nepal <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  list="nepal-locations-list"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Select or enter location (e.g. Kathmandu Maitighar)"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                />
                <datalist id="nepal-locations-list">
                  {NEPAL_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
              {errors.location && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Related IT Device (Optional)
              </label>
              <div className="relative">
                <Laptop className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                >
                  <option value="">-- No specific device / Not in list --</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id}: {d.name} ({d.ipAddress || d.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Problem Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact symptoms, error codes, affected computers, when the issue started, and troubleshooting steps already attempted..."
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                errors.description
                  ? "border-rose-300 focus:ring-rose-200 text-rose-900"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Admin / Tech options: Assign Tech & Estimated Cost */}
          {(isAdmin || user?.role === "technician") && (
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
                  Direct Assign Technician (Admin / Dispatcher)
                </label>
                <select
                  value={assignedTechnicianId}
                  onChange={(e) => setAssignedTechnicianId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                >
                  <option value="">-- Leave Unassigned for now --</option>
                  {technicians.map((tc) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.name} ({tc.specialty || tc.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
                  Estimated Repair / Service Cost (NPR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-400">
              Reporting as: <strong className="text-slate-700">{user?.name}</strong> ({user?.email})
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/tickets")}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Ticket"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
