import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Laptop,
  BookOpen,
  Network,
  Users,
  Wrench,
  BarChart3,
  Settings,
  ShieldAlert,
  PhoneCall,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, isTechnician } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "technician", "user"],
    },
    {
      label: "All Tickets",
      path: "/tickets",
      icon: Ticket,
      roles: ["admin", "technician", "user"],
    },
    {
      label: "Create Ticket",
      path: "/tickets/new",
      icon: PlusCircle,
      roles: ["admin", "technician", "user"],
      highlight: true,
    },
    {
      label: "IT Devices",
      path: "/devices",
      icon: Laptop,
      roles: ["admin", "technician", "user"],
    },
    {
      label: "Knowledge Base",
      path: "/knowledge-base",
      icon: BookOpen,
      roles: ["admin", "technician", "user"],
    },
    {
      label: "Network Tools",
      path: "/network-tools",
      icon: Network,
      roles: ["admin", "technician", "user"],
    },
    {
      label: "IT Reports",
      path: "/reports",
      icon: BarChart3,
      roles: ["admin", "technician"],
    },
    {
      label: "Technicians",
      path: "/technicians",
      icon: Wrench,
      roles: ["admin"],
    },
    {
      label: "User Accounts",
      path: "/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["admin", "technician", "user"],
    },
  ];

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user?.role || "user")
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-900/40">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  HelpDesk
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                  NP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                ITSM Platform Nepal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current user role banner */}
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-100 truncate">{user?.name || "Guest"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    isAdmin
                      ? "bg-purple-900/60 text-purple-300 border border-purple-700/50"
                      : isTechnician
                      ? "bg-amber-900/60 text-amber-300 border border-amber-700/50"
                      : "bg-sky-900/60 text-sky-300 border border-sky-700/50"
                  }`}
                >
                  {user?.role}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {user?.organization ? user.organization.split(" ")[0] : "Nepal"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-600/30"
                    : item.highlight
                    ? "text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? "text-white" : item.highlight ? "text-sky-400" : "text-slate-400"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Support Banner */}
        <div className="p-3 m-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Nepal IT Helpline
            </span>
          </div>
          <p className="text-xs font-mono font-bold text-white tracking-wide">
            +977 1-4412345
          </p>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
            NST: Sun–Fri, 9:00 AM – 6:00 PM
          </p>
        </div>
      </aside>
    </>
  );
}
