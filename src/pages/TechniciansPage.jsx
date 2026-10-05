import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { authService } from "../services/authService.js";
import { ticketService } from "../services/ticketService.js";
import { STORAGE_UPDATE_EVENT } from "../services/storage.js";
import { NEPAL_LOCATIONS } from "../data/seedData.js";
import Modal from "../components/common/Modal.jsx";
import {
  Wrench,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Ticket,
  Shield,
  Star,
  Award,
} from "lucide-react";

export default function TechniciansPage() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [technicians, setTechnicians] = useState(() => authService.getTechnicians());
  const [tickets, setTickets] = useState(() => ticketService.getAll());

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "Network & Optical Fiber",
    phone: "+977 98",
    location: "Kathmandu (New Baneshwor)",
    department: "Field Support Operations",
  });

  const loadData = () => {
    setTechnicians(authService.getTechnicians());
    setTickets(ticketService.getAll());
  };

  useEffect(() => {
    window.addEventListener(STORAGE_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(STORAGE_UPDATE_EVENT, loadData);
  }, []);

  const handleCreateTechnician = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast("Name and email are required.", "error");
      return;
    }

    authService.createUser({
      ...formData,
      role: "technician",
      roleTitle: "Field Support Specialist",
      organization: "HelpDesk Nepal Central Hub",
    });

    showToast(`Technician ${formData.name} added.`, "success");
    setShowAddModal(false);
    setFormData({
      name: "",
      email: "",
      specialty: "Network & Optical Fiber",
      phone: "+977 98",
      location: "Kathmandu (New Baneshwor)",
      department: "Field Support Operations",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-600" />
            Field Support Technicians &amp; Engineers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Active IT specialists dispatched across Nepal hubs for on-site diagnostics
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Technician</span>
          </button>
        )}
      </div>

      {/* Grid of Technician Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((tech) => {
          const assignedTickets = tickets.filter(
            (t) => t.assignedTechnicianId === tech.id && t.status !== "Closed"
          );
          const resolvedCount = tickets.filter(
            (t) => t.assignedTechnicianId === tech.id && (t.status === "Resolved" || t.status === "Closed")
          ).length;

          return (
            <div
              key={tech.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={tech.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{tech.name}</h3>
                      <p className="text-xs text-amber-700 font-semibold">{tech.specialty || "Hardware & Systems"}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> On Duty
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tech.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-slate-700">{tech.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{tech.email}</span>
                  </div>
                </div>

                {/* Workload Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Active Tickets
                    </span>
                    <span className="text-base font-extrabold text-indigo-700">
                      {assignedTickets.length}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Resolved
                    </span>
                    <span className="text-base font-extrabold text-emerald-600">
                      {resolvedCount}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={`/tickets?tech=${tech.id}`}
                className="w-full text-center py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 rounded-lg transition-colors block"
              >
                View Assigned Tickets &rarr;
              </Link>
            </div>
          );
        })}
      </div>

      {/* Add Technician Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Field Support Specialist"
      >
        <form onSubmit={handleCreateTechnician} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. Sunil Gurung"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="e.g. sunil.g@helpdesknepal.com"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Technical Specialty / Expertise
            </label>
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="e.g. Optical Fiber, MikroTik & Cisco Routing"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+977 9806543210"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location in Nepal
              </label>
              <input
                type="text"
                list="tech-locs"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Pokhara (New Road)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
              <datalist id="tech-locs">
                {NEPAL_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              Add Specialist
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
