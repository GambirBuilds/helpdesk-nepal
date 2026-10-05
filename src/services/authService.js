/**
 * Auth Service for HelpDesk Nepal
 * Manages demo authentication, role switching, and user profiles.
 */

import { getItem, setItem, STORAGE_KEYS } from "./storage.js";

export const authService = {
  getCurrentUser() {
    return getItem(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user) {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  getAllUsers() {
    return getItem(STORAGE_KEYS.USERS, []);
  },

  getTechnicians() {
    const users = this.getAllUsers();
    return users.filter((u) => u.role === "technician");
  },

  login(email, password) {
    const users = this.getAllUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return { success: false, error: "Invalid email or demo account not found." };
    }

    // In demo mode, accept any non-empty password, or standard demo passwords
    if (!password || password.trim().length === 0) {
      return { success: false, error: "Please enter your password." };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  },

  switchDemoRole(role) {
    const users = this.getAllUsers();
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      this.setCurrentUser(targetUser);
      return targetUser;
    }
    return null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  createUser(userData) {
    const users = this.getAllUsers();
    const newUser = {
      id: `usr-${String(users.length + 1).padStart(3, "0")}`,
      name: userData.name?.trim(),
      email: userData.email?.trim().toLowerCase(),
      role: userData.role || "user",
      roleTitle: userData.roleTitle?.trim() || "Staff Member",
      department: userData.department?.trim() || "Operations",
      organization: userData.organization?.trim() || "College / Office",
      phone: userData.phone?.trim() || "+977 9800000000",
      location: userData.location || "Kathmandu (New Baneshwor)",
      avatar:
        userData.avatar ||
        `https://images.unsplash.com/photo-${1500000000000 + (users.length % 5)}?w=150&auto=format&fit=crop&q=80`,
      status: "active",
      createdAt: new Date().toISOString(),
      ...(userData.role === "technician" ? {
        specialty: userData.specialty || "Hardware & Network Support",
        assignedTicketsCount: 0,
      } : {}),
    };

    const updated = [...users, newUser];
    setItem(STORAGE_KEYS.USERS, updated);
    return newUser;
  },

  updateUser(id, updates) {
    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updatedUser = {
      ...users[index],
      ...updates,
    };

    users[index] = updatedUser;
    setItem(STORAGE_KEYS.USERS, users);

    // If current logged-in user updated their own profile
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this.setCurrentUser(updatedUser);
    }

    return updatedUser;
  },

  deleteUser(id) {
    const users = this.getAllUsers();
    const filtered = users.filter((u) => u.id !== id);
    setItem(STORAGE_KEYS.USERS, filtered);
    return true;
  },
};
