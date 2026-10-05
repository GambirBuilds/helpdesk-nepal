import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  ShieldAlert,
  Shield,
  Wrench,
  User,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  Server,
  Network,
  BookOpen,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@helpdesknepal.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user.name}!`, "success");
      navigate("/dashboard");
    } else {
      setError(result.error || "Authentication failed.");
      showToast(result.error || "Authentication failed", "error");
    }
  };

  const handleQuickLogin = (demoEmail, demoRoleName) => {
    setEmail(demoEmail);
    setPassword("demo123");
    const result = login(demoEmail, "demo123");
    if (result.success) {
      showToast(`Logged in as ${demoRoleName}: ${result.user.name}`, "success");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient decorative shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-sky-500 shadow-xl shadow-indigo-950/50 mb-4 border border-indigo-400/30">
          <ShieldAlert className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          HelpDesk <span className="text-rose-500">Nepal</span>
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-sm mx-auto">
          Modern IT Service &amp; Help-Desk Platform for Schools, Colleges, Offices &amp; Enterprises in Nepal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-slate-100">
          {/* Quick Demo Login selector */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> One-Click Demo Accounts
              </span>
              <span className="text-[11px] text-slate-500">No registration needed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@helpdesknepal.com", "Administrator")}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-purple-200 bg-purple-50/60 hover:bg-purple-100 hover:border-purple-300 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-purple-900">Administrator</span>
                <span className="text-[10px] text-purple-700">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("technician@helpdesknepal.com", "Technician")}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100 hover:border-amber-300 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-amber-900">Technician</span>
                <span className="text-[10px] text-amber-700">Manage &amp; Resolve</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("user@helpdesknepal.com", "User")}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-sky-200 bg-sky-50/60 hover:bg-sky-100 hover:border-sky-300 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-sky-900">User / Student</span>
                <span className="text-[10px] text-sky-700">Create Tickets</span>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or Sign In with Credentials
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@helpdesknepal.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Demo: Any password works</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to HelpDesk"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Highlights & Nepal features */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <Server className="w-4 h-4 text-indigo-500 mb-1" />
              <span className="text-[11px] font-semibold text-slate-700">Nepal Assets</span>
              <span className="text-[9px] text-slate-400">KTM, PKR, CHT</span>
            </div>
            <div className="flex flex-col items-center">
              <Network className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-[11px] font-semibold text-slate-700">Subnet Tools</span>
              <span className="text-[9px] text-slate-400">IPv4 &amp; CIDR</span>
            </div>
            <div className="flex flex-col items-center">
              <BookOpen className="w-4 h-4 text-sky-500 mb-1" />
              <span className="text-[11px] font-semibold text-slate-700">Knowledge Base</span>
              <span className="text-[9px] text-slate-400">Step-by-Step</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
