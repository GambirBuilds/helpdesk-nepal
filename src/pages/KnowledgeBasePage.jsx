import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { kbService } from "../services/kbService.js";
import { STORAGE_UPDATE_EVENT } from "../services/storage.js";
import Modal from "../components/common/Modal.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import {
  BookOpen,
  Search,
  PlusCircle,
  Clock,
  Terminal,
  ChevronRight,
  Wifi,
  Printer,
  ShieldAlert,
  Server,
  Monitor,
  KeyRound,
  Mail,
  Zap,
  Globe,
  Tag,
} from "lucide-react";

export default function KnowledgeBasePage() {
  const { isAdmin, isTechnician, user } = useAuth();
  const { showToast } = useToast();

  const [articles, setArticles] = useState(() => kbService.getAll());
  const [categories, setCategories] = useState(() => kbService.getCategories());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // New Article Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Internet problems");
  const [newSummary, setNewSummary] = useState("");
  const [newTags, setNewTags] = useState("");
  const [step1Title, setStep1Title] = useState("");
  const [step1Instruction, setStep1Instruction] = useState("");
  const [step1Command, setStep1Command] = useState("");

  const loadData = () => {
    setArticles(kbService.getAll());
    setCategories(kbService.getCategories());
  };

  useEffect(() => {
    window.addEventListener(STORAGE_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(STORAGE_UPDATE_EVENT, loadData);
  }, []);

  const filteredArticles = kbService.search(searchQuery, selectedCategory);

  const getCategoryIcon = (cat) => {
    const c = (cat || "").toLowerCase();
    if (c.includes("internet") || c.includes("network")) return Globe;
    if (c.includes("wifi")) return Wifi;
    if (c.includes("printer")) return Printer;
    if (c.includes("windows") || c.includes("slow")) return Monitor;
    if (c.includes("login") || c.includes("security")) return KeyRound;
    if (c.includes("email")) return Mail;
    return BookOpen;
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      showToast("Please provide title and summary.", "error");
      return;
    }

    const steps = [];
    if (step1Title.trim() || step1Instruction.trim()) {
      steps.push({
        step: 1,
        title: step1Title || "Initial Step",
        instruction: step1Instruction || "Follow standard IT procedure.",
        command: step1Command || undefined,
      });
    }

    const article = kbService.create(
      {
        title: newTitle,
        category: newCategory,
        summary: newSummary,
        tags: newTags,
        readTime: "4 min read",
        troubleshootingSteps: steps,
        symptoms: [],
      },
      user
    );

    showToast("Knowledge Base article published!", "success");
    setShowAddModal(false);
    setNewTitle("");
    setNewSummary("");
    setNewTags("");
    setStep1Title("");
    setStep1Instruction("");
    setStep1Command("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
              IT Troubleshooting Manual
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            IT Knowledge Base &amp; SOP Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Standard Operating Procedures (SOPs), terminal repair commands, and diagnostic workflows for Nepal network, printer, and system issues.
          </p>

          {/* Search Input inside banner */}
          <div className="mt-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symptom, command (e.g. ipconfig, ping, spooler), or error..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/95 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-400 font-medium shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Category Pills & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-4xl text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {(isAdmin || isTechnician) && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex-shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Article</span>
          </button>
        )}
      </div>

      {/* Article Cards Grid */}
      {filteredArticles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No troubleshooting articles match your query"
          description="Try searching with different keywords like 'gateway', 'dhcp', 'print', or 'login'."
          actionLabel="Clear Search"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("All");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((art) => {
            const CatIcon = getCategoryIcon(art.category);

            return (
              <Link
                key={art.id}
                to={`/knowledge-base/${art.id}`}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      <CatIcon className="w-3 h-3" />
                      {art.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" /> {art.readTime || "3 min read"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2 mb-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    By {art.author}
                  </span>
                  <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Read guide <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Add Article Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Publish New IT Knowledge Article"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateArticle} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Article Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              placeholder="e.g. Solving Optical LOS Light Flashing Red on Fiber ONU"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              >
                <option value="Internet problems">Internet problems</option>
                <option value="Wi-Fi problems">Wi-Fi problems</option>
                <option value="Printer problems">Printer problems</option>
                <option value="Windows problems">Windows problems</option>
                <option value="Login problems">Login problems</option>
                <option value="Email problems">Email problems</option>
                <option value="Slow computer">Slow computer</option>
                <option value="DNS problems">DNS problems</option>
                <option value="IP configuration problems">IP configuration problems</option>
                <option value="Network connectivity problems">Network connectivity problems</option>
                <option value="Software installation problems">Software installation problems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Search Tags (comma separated)
              </label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="fiber, onu, loss, rxpower"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Summary / Overview <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              required
              placeholder="Brief explanation of the fault and when to use this troubleshooting guide..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Step 1 Diagnostic
            </span>
            <input
              type="text"
              value={step1Title}
              onChange={(e) => setStep1Title(e.target.value)}
              placeholder="Step Title (e.g. Inspect Patch Cord)"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
            />
            <textarea
              rows={2}
              value={step1Instruction}
              onChange={(e) => setStep1Instruction(e.target.value)}
              placeholder="Detailed instructions for the user/technician..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
            />
            <input
              type="text"
              value={step1Command}
              onChange={(e) => setStep1Command(e.target.value)}
              placeholder="CLI Command (optional, e.g. ping 192.168.1.1)"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
              Publish Article
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
