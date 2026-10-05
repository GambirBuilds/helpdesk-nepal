import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { resetDemoData } from "../services/storage.js";
import { NEPAL_LOCATIONS } from "../data/seedData.js";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import {
  Settings,
  Building,
  User,
  RotateCcw,
  Globe,
  Clock,
  Phone,
  Mail,
  Shield,
  Save,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "+977 ");
  const [profileDepartment, setProfileDepartment] = useState(user?.department || "");
  const [profileLocation, setProfileLocation] = useState(user?.location || "Kathmandu (Maitighar)");

  const [orgName, setOrgName] = useState("Sagarmatha Engineering College & IT Infrastructure");
  const [supportPhone, setSupportPhone] = useState("+977 1-4412345");
  const [emergencyPhone, setEmergencyPhone] = useState("+977 9841234567");

  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      phone: profilePhone,
      department: profileDepartment,
      location: profileLocation,
    });
    showToast("Profile settings updated successfully.", "success");
  };

  const handleSaveOrg = (e) => {
    e.preventDefault();
    showToast("Organization IT parameters updated.", "success");
  };

  const handleResetData = () => {
    resetDemoData();
    showToast("Demo data successfully reset to initial factory state.", "success");
    setShowResetDialog(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          System &amp; Organization Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure Nepal regional settings, IT support hotlines, profile details, and storage state
        </p>
      </div>

      {/* User Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Your User Profile</h2>
            <p className="text-xs text-slate-500">Update personal contact information and duty station in Nepal</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (Nepal)
              </label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={profileDepartment}
                onChange={(e) => setProfileDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Duty Location in Nepal
              </label>
              <input
                type="text"
                list="settings-locs"
                value={profileLocation}
                onChange={(e) => setProfileLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
              <datalist id="settings-locs">
                {NEPAL_LOCATIONS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Regional & Localization Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Nepal Localization &amp; Hotlines</h2>
            <p className="text-xs text-slate-500">Default currency, standard time, and emergency dispatch contact</p>
          </div>
        </div>

        <form onSubmit={handleSaveOrg} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Standard Time Zone
              </label>
              <input
                type="text"
                disabled
                value="Nepal Standard Time (NST / UTC+5:45)"
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Accounting Currency
              </label>
              <input
                type="text"
                disabled
                value="Nepalese Rupee (NPR / Rs.)"
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Campus IT Support Hotline
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Critical Incident Hotline (24/7)
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Regional Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white rounded-2xl border border-rose-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div>
            <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Factory Reset Demo Data
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Reset all support tickets, IT devices, knowledge base articles, and notifications back to original demo state
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-500 max-w-md">
            Useful when presenting, testing new workflows, or demonstrating HelpDesk Nepal features to evaluators.
          </p>

          <button
            type="button"
            onClick={() => setShowResetDialog(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleResetData}
        title="Reset All HelpDesk Nepal Data"
        message="This will re-initialize LocalStorage with all sample Nepal tickets, devices, and knowledge base articles. Any newly created records will be overwritten."
        confirmText="Confirm Reset"
        isDestructive={true}
      />
    </div>
  );
}
