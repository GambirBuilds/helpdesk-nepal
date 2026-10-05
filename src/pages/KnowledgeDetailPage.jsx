import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { kbService } from "../services/kbService.js";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Terminal,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  HelpCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";

export default function KnowledgeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const article = kbService.getById(id);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  if (!article) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Article Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested troubleshooting guide does not exist.
        </p>
        <Link
          to="/knowledge-base"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
        </Link>
      </div>
    );
  }

  const handleCopy = (command, index) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    showToast("Command copied to clipboard.", "info");
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleFeedback = (isHelpful) => {
    setFeedbackSent(true);
    showToast(isHelpful ? "Thank you for your feedback!" : "Feedback recorded. We will improve this guide.", "success");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      kbService.delete(article.id);
      showToast("Article deleted.", "info");
      navigate("/knowledge-base");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/knowledge-base"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Base</span>
        </Link>

        {isAdmin && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded border border-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Article</span>
          </button>
        )}
      </div>

      {/* Main Article Container */}
      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 pb-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {article.category}
            </span>
            {article.tags?.map((tag) => (
              <span key={tag} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Written by <strong className="text-slate-700 font-semibold">{article.author}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Updated {article.updatedAt}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readTime || "4 min read"}
            </span>
          </div>
        </div>

        {/* Overview Summary */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block mb-1">Issue Overview:</strong>
          {article.summary}
        </div>

        {/* Symptoms Checklist */}
        {article.symptoms && article.symptoms.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Recognized Symptoms &amp; Error Messages
            </h3>
            <ul className="space-y-1.5 pl-2">
              {article.symptoms.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step-by-Step Diagnostic Instructions */}
        <div className="space-y-6 pt-2">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            Step-by-Step Diagnostic &amp; Resolution Procedure
          </h2>

          <div className="space-y-6">
            {article.troubleshootingSteps?.map((step, idx) => (
              <div
                key={step.step || idx}
                className="bg-slate-50/50 rounded-xl p-5 border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                    {step.step || idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10 whitespace-pre-line">
                  {step.instruction}
                </p>

                {step.command && (
                  <div className="ml-10 relative">
                    <div className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs font-mono overflow-x-auto border border-slate-800 flex items-center justify-between gap-4">
                      <code className="text-sky-300 whitespace-pre">
                        {step.command}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(step.command, idx)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0 flex items-center gap-1 text-[11px]"
                        title="Copy command to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl">
          <div>
            <p className="text-xs font-bold text-slate-800">Was this article helpful?</p>
            <p className="text-[11px] text-slate-500">Your feedback helps our Nepal IT team improve our documentation.</p>
          </div>

          {feedbackSent ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Feedback submitted
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" /> Yes
              </button>
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-rose-500" /> No
              </button>
            </div>
          )}
        </div>

        {/* Fallback to Ticket */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-950">Issue still not resolved?</p>
              <p className="text-[11px] text-indigo-800">
                Submit a support ticket and a field technician in Nepal will investigate on-site.
              </p>
            </div>
          </div>
          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex-shrink-0 transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Open Support Ticket</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
