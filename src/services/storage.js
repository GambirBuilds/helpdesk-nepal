/**
 * Storage service for HelpDesk Nepal
 * Manages LocalStorage with automatic seed data fallback and event synchronization.
 */

import {
  INITIAL_USERS,
  INITIAL_DEVICES,
  INITIAL_TICKETS,
  INITIAL_KB_ARTICLES,
  INITIAL_NOTIFICATIONS,
} from "../data/seedData.js";

const STORAGE_KEYS = {
  USERS: "hdn_users",
  DEVICES: "hdn_devices",
  TICKETS: "hdn_tickets",
  KB_ARTICLES: "hdn_kb_articles",
  NOTIFICATIONS: "hdn_notifications",
  CURRENT_USER: "hdn_current_user",
  APP_INITIALIZED: "hdn_initialized_v2",
};

// Custom event name for instant state updates
export const STORAGE_UPDATE_EVENT = "hdn_storage_updated";

export function initializeStorage(force = false) {
  try {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.APP_INITIALIZED);
    if (!isInitialized || force) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(INITIAL_DEVICES));
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
      localStorage.setItem(STORAGE_KEYS.KB_ARTICLES, JSON.stringify(INITIAL_KB_ARTICLES));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      
      // Default initial login user: Admin
      if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || force) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
      }

      localStorage.setItem(STORAGE_KEYS.APP_INITIALIZED, "true");
      dispatchStorageEvent("all");
    }
  } catch (err) {
    console.error("Failed to initialize HelpDesk Nepal storage:", err);
  }
}

export function getItem(key, fallback = []) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    dispatchStorageEvent(key);
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export function dispatchStorageEvent(key) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(STORAGE_UPDATE_EVENT, { detail: { key } })
    );
  }
}

export function resetDemoData() {
  initializeStorage(true);
}

export { STORAGE_KEYS };
