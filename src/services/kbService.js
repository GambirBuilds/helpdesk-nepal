/**
 * Knowledge Base Service for HelpDesk Nepal
 * Manages searchable troubleshooting procedures, commands, and IT guides.
 */

import { getItem, setItem, STORAGE_KEYS } from "./storage.js";

export const kbService = {
  getAll() {
    const list = getItem(STORAGE_KEYS.KB_ARTICLES, []);
    return list;
  },

  getById(id) {
    if (!id) return null;
    const list = this.getAll();
    return list.find((a) => a.id.toLowerCase() === id.toLowerCase()) || null;
  },

  search(query = "", category = "") {
    let list = this.getAll();
    const q = query.trim().toLowerCase();

    if (category && category !== "All") {
      list = list.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      list = list.filter((a) => {
        const inTitle = a.title.toLowerCase().includes(q);
        const inSummary = a.summary?.toLowerCase().includes(q);
        const inTags = a.tags?.some((t) => t.toLowerCase().includes(q));
        const inSteps = a.troubleshootingSteps?.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.instruction.toLowerCase().includes(q) ||
            (s.command && s.command.toLowerCase().includes(q))
        );
        const inSymptoms = a.symptoms?.some((sym) => sym.toLowerCase().includes(q));
        return inTitle || inSummary || inTags || inSteps || inSymptoms;
      });
    }

    return list;
  },

  getCategories() {
    const list = this.getAll();
    const cats = new Set(list.map((a) => a.category));
    return ["All", ...Array.from(cats)];
  },

  create(data, author) {
    const list = this.getAll();
    const newId = `kb-${String(list.length + 1).padStart(3, "0")}`;

    const newArticle = {
      id: newId,
      title: data.title?.trim() || "Untitled Troubleshooting Article",
      category: data.category || "General",
      tags: Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === "string"
        ? data.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [],
      readTime: data.readTime || "4 min read",
      author: author?.name || "HelpDesk IT Specialist",
      updatedAt: new Date().toISOString().split("T")[0],
      summary: data.summary?.trim() || "",
      symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
      troubleshootingSteps: Array.isArray(data.troubleshootingSteps)
        ? data.troubleshootingSteps
        : [],
    };

    const updated = [newArticle, ...list];
    setItem(STORAGE_KEYS.KB_ARTICLES, updated);
    return newArticle;
  },

  update(id, updates) {
    const list = this.getAll();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedArticle = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    list[index] = updatedArticle;
    setItem(STORAGE_KEYS.KB_ARTICLES, list);
    return updatedArticle;
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter((a) => a.id !== id);
    setItem(STORAGE_KEYS.KB_ARTICLES, filtered);
    return true;
  },
};
