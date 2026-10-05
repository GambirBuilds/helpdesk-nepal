import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { deviceService } from "../services/deviceService.js";
import { STORAGE_UPDATE_EVENT } from "../services/storage.js";
import {
  DEVICE_TYPES,
  DEVICE_STATUSES,
  NEPAL_LOCATIONS,
} from "../data/seedData.js";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import {
  Laptop,
  Monitor,
  Printer,
  Router,
  Server,
  Wifi,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HardDrive,
  MapPin,
  User,
  Shield,
  Layers,
} from "lucide-react";

export default function DevicesPage() {
  const { isAdmin, isTechnician } = useAuth();
  const { showToast } = useToast();

  const [devices, setDevices] = useState(() => deviceService.getAll());
  const [stats, setStats] = useState(() => deviceService.getStats());

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Add / Edit Modal state
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Desktop",
    brand: "",
    model: "",
    serialNumber: "",
    ipAddress: "",
    macAddress: "",
    location: "Kathmandu (Maitighar)",
    assignedUser: "",
    status: "Active",
    os: "Windows 11 Pro",
    notes: "",
  });

  // Delete confirm state
  const [deleteDeviceId, setDeleteDeviceId] = useState(null);

  const loadData = () => {
    setDevices(deviceService.getAll());
    setStats(deviceService.getStats());
  };

  useEffect(() => {
    window.addEventListener(STORAGE_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(STORAGE_UPDATE_EVENT, loadData);
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      if (typeFilter !== "All" && d.type !== typeFilter) return false;
      if (statusFilter !== "All" && d.status !== statusFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const mName = d.name?.toLowerCase().includes(q);
        const mId = d.id?.toLowerCase().includes(q);
        const mIp = d.ipAddress?.toLowerCase().includes(q);
        const mMac = d.macAddress?.toLowerCase().includes(q);
        const mSerial = d.serialNumber?.toLowerCase().includes(q);
        const mBrand = d.brand?.toLowerCase().includes(q);
        const mUser = d.assignedUser?.toLowerCase().includes(q);
        const mLoc = d.location?.toLowerCase().includes(q);

        if (!mName && !mId && !mIp && !mMac && !mSerial && !mBrand && !mUser && !mLoc) {
          return false;
        }
      }
      return true;
    });
  }, [devices, searchTerm, typeFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingDevice(null);
    setFormData({
      name: "",
      type: "Desktop",
      brand: "",
      model: "",
      serialNumber: "",
      ipAddress: "",
      macAddress: "",
      location: "Kathmandu (Maitighar)",
      assignedUser: "",
      status: "Active",
      os: "Windows 11 Pro",
      notes: "",
    });
    setShowDeviceModal(true);
  };

  const handleOpenEdit = (dev) => {
    setEditingDevice(dev);
    setFormData({
      name: dev.name || "",
      type: dev.type || "Desktop",
      brand: dev.brand || "",
      model: dev.model || "",
      serialNumber: dev.serialNumber || "",
      ipAddress: dev.ipAddress || "",
      macAddress: dev.macAddress || "",
      location: dev.location || "Kathmandu (Maitighar)",
      assignedUser: dev.assignedUser || "",
      status: dev.status || "Active",
      os: dev.os || "",
      notes: dev.notes || "",
    });
    setShowDeviceModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Device name is required.", "error");
      return;
    }

    if (editingDevice) {
      deviceService.update(editingDevice.id, formData);
      showToast(`Device ${editingDevice.id} updated.`, "success");
    } else {
      const created = deviceService.create(formData);
      showToast(`Device ${created.id} registered successfully.`, "success");
    }
    setShowDeviceModal(false);
  };

  const handleDelete = () => {
    if (!deleteDeviceId) return;
    deviceService.delete(deleteDeviceId);
    showToast(`Device ${deleteDeviceId} deleted.`, "info");
    setDeleteDeviceId(null);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case "Desktop": return Monitor;
      case "Laptop": return Laptop;
      case "Printer": return Printer;
      case "Router": return Router;
      case "Switch": return Layers;
      case "Server": return Server;
      case "Access Point": return Wifi;
      default: return HardDrive;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active</span>;
      case "Maintenance":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Maintenance</span>;
      case "Offline":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Offline</span>;
      case "Retired":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Retired</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            IT Device &amp; Asset Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hardware inventory, IP/MAC tracking, and operational statuses across Nepal offices
          </p>
        </div>

        {(isAdmin || isTechnician) && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Device</span>
          </button>
        )}
      </div>

      {/* Asset Status Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Tracked</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Active Online</p>
            <p className="text-2xl font-extrabold text-emerald-600">{stats.active}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Maintenance</p>
            <p className="text-2xl font-extrabold text-amber-600">{stats.maintenance}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Offline / Down</p>
            <p className="text-2xl font-extrabold text-rose-600">{stats.offline}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, IP, MAC, serial, or user..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
            >
              <option value="All">All Device Types</option>
              {DEVICE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
            >
              <option value="All">All Statuses</option>
              {DEVICE_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || typeFilter !== "All" || statusFilter !== "All") && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredDevices.length}</strong> of {devices.length} devices
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("All");
                setStatusFilter("All");
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Device Table */}
      {filteredDevices.length === 0 ? (
        <EmptyState
          title="No IT devices found"
          description="Try clearing your search query or registering a new hardware asset."
          actionLabel="Register Device"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Type &amp; Brand</th>
                  <th className="py-3 px-4">IP &amp; MAC Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 hidden md:table-cell">Location &amp; User</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Specs / OS</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map((dev) => {
                  const Icon = getDeviceIcon(dev.type);

                  return (
                    <tr key={dev.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Name & ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {dev.name}
                            </p>
                            <span className="font-mono text-[10px] text-slate-400">
                              {dev.id} • SN: {dev.serialNumber || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type & Brand */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{dev.brand} {dev.model}</span>
                        <span className="block text-[11px] text-slate-500">{dev.type}</span>
                      </td>

                      {/* IP & MAC */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <span className="font-bold text-slate-800">{dev.ipAddress}</span>
                        <span className="block text-[10px] text-slate-400">{dev.macAddress}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(dev.status)}
                      </td>

                      {/* Location & User */}
                      <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-40">{dev.location}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate">
                          User: {dev.assignedUser || "Unassigned"}
                        </span>
                      </td>

                      {/* Specs / OS */}
                      <td className="py-3.5 px-4 hidden lg:table-cell max-w-xs truncate text-slate-600">
                        {dev.os}
                        {dev.notes && (
                          <span className="block text-[10px] text-slate-400 truncate">
                            {dev.notes}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {(isAdmin || isTechnician) && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(dev)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
                              title="Edit device"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => setDeleteDeviceId(dev.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete device"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteDeviceId)}
        onClose={() => setDeleteDeviceId(null)}
        onConfirm={handleDelete}
        title="Delete IT Asset"
        message={`Are you sure you want to delete ${deleteDeviceId} from the active inventory?`}
        confirmText="Delete Asset"
        isDestructive={true}
      />

      {/* Add / Edit Device Modal */}
      <Modal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        title={editingDevice ? `Edit Device: ${editingDevice.id}` : "Register New IT Asset"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Device Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Lab-3 Dell OptiPlex Workstation"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Device Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              >
                {DEVICE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Operational Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              >
                {DEVICE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Dell, HP, Cisco, MikroTik"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. OptiPlex 7090, CCR1036"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="e.g. SN-DEL-984210"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned User / Custodian
              </label>
              <input
                type="text"
                value={formData.assignedUser}
                onChange={(e) => setFormData({ ...formData, assignedUser: e.target.value })}
                placeholder="e.g. Priya Sharma (Lab Coordinator)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                IPv4 Address
              </label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="e.g. 192.168.10.45"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                MAC Address
              </label>
              <input
                type="text"
                value={formData.macAddress}
                onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                placeholder="e.g. 00:1A:2B:3C:4D:5E"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location (Nepal)
              </label>
              <input
                type="text"
                list="nepal-dev-locs"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Kathmandu (Maitighar Lab 3)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
              <datalist id="nepal-dev-locs">
                {NEPAL_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Operating System / Firmware
              </label>
              <input
                type="text"
                value={formData.os}
                onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                placeholder="e.g. Windows 11 Pro / RouterOS 7.14"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Internal IT Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Maintenance history, VLAN port assignment, warranty details..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDeviceModal(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              {editingDevice ? "Save Changes" : "Register Device"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
