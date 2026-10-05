import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

// Pages
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";
import NewTicketPage from "./pages/NewTicketPage.jsx";
import TicketDetailPage from "./pages/TicketDetailPage.jsx";
import DevicesPage from "./pages/DevicesPage.jsx";
import KnowledgeBasePage from "./pages/KnowledgeBasePage.jsx";
import KnowledgeDetailPage from "./pages/KnowledgeDetailPage.jsx";
import NetworkToolsPage from "./pages/NetworkToolsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import TechniciansPage from "./pages/TechniciansPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Protected Admin Route Guard
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
        <h2 className="text-base font-bold text-rose-600">Access Restricted</h2>
        <p className="text-xs text-slate-500">
          This section is restricted to HelpDesk Nepal Administrators. Switch to the Admin demo role in the top bar to inspect this page.
        </p>
      </div>
    );
  }
  return children;
}

// Protected Tech & Admin Guard
function StaffRoute({ children }) {
  const { user, isAdmin, isTechnician } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin && !isTechnician) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
        <h2 className="text-base font-bold text-rose-600">Staff Access Required</h2>
        <p className="text-xs text-slate-500">
          This operational report requires Technician or Administrator privileges.
        </p>
      </div>
    );
  }
  return children;
}

// Redirect logged-in users away from /login
function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Login Route */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />

            {/* Authenticated Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/new" element={<NewTicketPage />} />
              <Route path="tickets/:id" element={<TicketDetailPage />} />
              <Route path="devices" element={<DevicesPage />} />
              <Route path="knowledge-base" element={<KnowledgeBasePage />} />
              <Route path="knowledge-base/:id" element={<KnowledgeDetailPage />} />
              <Route path="network-tools" element={<NetworkToolsPage />} />
              
              {/* Admin-only Routes */}
              <Route
                path="users"
                element={
                  <AdminRoute>
                    <UsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="technicians"
                element={
                  <AdminRoute>
                    <TechniciansPage />
                  </AdminRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="reports"
                element={
                  <StaffRoute>
                    <ReportsPage />
                  </StaffRoute>
                }
              />

              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
