/**
 * Notification service for HelpDesk Nepal
 */

import { getItem, setItem, STORAGE_KEYS } from "./storage.js";

export const notificationService = {
  getAll() {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  getUnreadCount() {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    return list.filter((n) => !n.read).length;
  },

  markAsRead(id) {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  markAllAsRead() {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    const updated = list.map((n) => ({ ...n, read: true }));
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  clearAll() {
    setItem(STORAGE_KEYS.NOTIFICATIONS, []);
    return [];
  },

  create({ title, message, type = "info", link = "/tickets" }) {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type,
      link,
      read: false,
      timestamp: new Date().toISOString(),
    };
    const updated = [newNotif, ...list];
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return newNotif;
  },
};
