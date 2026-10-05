import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { authService } from "../services/authService.js";
import { STORAGE_UPDATE_EVENT } from "../services/storage.js";
import { NEPAL_LOCATIONS } from "../data/seedData.js";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import {
  Users,
  PlusCircle,
  Search,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Trash2,
  Edit2,
  CheckCircle2,
} from "lucide-react";

export default function UsersPage() {
  const { isAdmin, user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState(() => authService.getAllUsers());
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    roleTitle: "",
    department: "",
    organization: "Sagarmatha Engineering College",
    phone: "+977 ",
    location: "Kathmandu (Maitighar)",
  });

  const [deleteUserId, setDeleteUserId] = useState(null);

  const loadData = () => {
    setUsers(authService.getAllUsers());
  };

  useEffect(() => {
    window.addEventListener(STORAGE_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(STORAGE_UPDATE_EVENT, loadData);
  }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "All" && u.role !== roleFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const mName = u.name?.toLowerCase().includes(q);
      const mEmail = u.email?.toLowerCase().includes(q);
      const mDept = u.department?.toLowerCase().includes(q);
      const mOrg = u.organization?.toLowerCase().includes(q);
      const mLoc = u.location?.toLowerCase().includes(q);
      if (!mName && !mEmail && !mDept && !mOrg && !mLoc) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "user",
      roleTitle: "Staff Member",
      department: "Academic Operations",
      organization: "Sagarmatha Engineering College",
      phone: "+977 98",
      location: "Kathmandu (Maitighar)",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (targetUser) => {
    setEditingUser(targetUser);
    setFormData({
      name: targetUser.name || "",
      email: targetUser.email || "",
      role: targetUser.role || "user",
      roleTitle: targetUser.roleTitle || "",
      department: targetUser.department || "",
      organization: targetUser.organization || "",
      phone: targetUser.phone || "",
      location: targetUser.location || "Kathmandu (Maitighar)",
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast("Name and email are required.", "error");
      return;
    }

    if (editingUser) {
      authService.updateUser(editingUser.id, formData);
      showToast(`User ${editingUser.name} updated.`, "success");
    } else {
      authService.createUser(formData);
      showToast(`User ${formData.name} added.`, "success");
    }
    setShowAddModal(false);
  };

  const handleDelete = () => {
    if (!deleteUserId) return;
    if (deleteUserId === currentUser?.id) {
      showToast("You cannot delete your own active account.", "error");
      setDeleteUserId(null);
      return;
    }
    authService.deleteUser(deleteUserId);
    showToast("User account removed.", "info");
    setDeleteUserId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            User &amp; Organization Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registered faculty, students, administrative staff, and IT support officers
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, department, organization..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
        >
          <option value="All">All Roles</option>
          <option value="admin">Administrators</option>
          <option value="technician">Technicians</option>
          <option value="user">Users / Requesters</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 hidden md:table-cell">Department &amp; Organization</th>
                <th className="py-3 px-4 hidden lg:table-cell">Contact &amp; Location</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Avatar & Name */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                        u.role === "admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : u.role === "technician"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      {u.roleTitle}
                    </span>
                  </td>

                  {/* Dept & Org */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <p className="font-semibold text-slate-800">{u.organization}</p>
                    <p className="text-[11px] text-slate-500">{u.department}</p>
                  </td>

                  {/* Phone & Loc */}
                  <td className="py-3.5 px-4 hidden lg:table-cell font-mono text-[11px] text-slate-600">
                    <div className="flex items-center gap-1 font-sans">
                      <Phone className="w-3 h-3 text-slate-400" /> {u.phone}
                    </div>
                    <div className="flex items-center gap-1 font-sans text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" /> {u.location}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
                            title="Edit user"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteUserId(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteUserId)}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDelete}
        title="Remove User Account"
        message="Are you sure you want to delete this user? They will no longer be able to log in."
        confirmText="Remove Account"
        isDestructive={true}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingUser ? `Edit User: ${editingUser.name}` : "Create User Profile"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. Ramesh Karki"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="user@helpdesknepal.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role Access Level
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="user">User / Requester</option>
                <option value="technician">Technician</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Designation / Title
              </label>
              <input
                type="text"
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                placeholder="e.g. Computer Lab Coordinator"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (Nepal)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+977 9841234567"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Organization / College
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Kathmandu University Institute"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Location in Nepal
            </label>
            <input
              type="text"
              list="user-locs"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Kathmandu (Maitighar)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
            <datalist id="user-locs">
              {NEPAL_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
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
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              {editingUser ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
