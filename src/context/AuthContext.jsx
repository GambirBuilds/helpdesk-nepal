import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService.js";
import { initializeStorage, STORAGE_UPDATE_EVENT, STORAGE_KEYS } from "../services/storage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Ensure storage is seeded on first load
  useEffect(() => {
    initializeStorage();
  }, []);

  const [user, setUser] = useState(() => authService.getCurrentUser());

  const refreshUser = useCallback(() => {
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    const handleStorageUpdate = (e) => {
      if (!e.detail || e.detail.key === STORAGE_KEYS.CURRENT_USER || e.detail.key === "all") {
        refreshUser();
      }
    };

    window.addEventListener(STORAGE_UPDATE_EVENT, handleStorageUpdate);
    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener(STORAGE_UPDATE_EVENT, handleStorageUpdate);
      window.removeEventListener("storage", refreshUser);
    };
  }, [refreshUser]);

  const login = (email, password) => {
    const res = authService.login(email, password);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchRole = (role) => {
    const newUser = authService.switchDemoRole(role);
    if (newUser) {
      setUser(newUser);
    }
    return newUser;
  };

  const updateProfile = (updates) => {
    if (!user) return null;
    const updated = authService.updateUser(user.id, updates);
    if (updated) {
      setUser(updated);
    }
    return updated;
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isTechnician: user?.role === "technician",
    isUser: user?.role === "user",
    login,
    logout,
    switchRole,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
