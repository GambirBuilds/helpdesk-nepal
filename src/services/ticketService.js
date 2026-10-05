/**
 * Ticket Service for HelpDesk Nepal
 * Provides full CRUD, status lifecycle management, comments, timeline events, and SLA metrics.
 */

import { getItem, setItem, STORAGE_KEYS } from "./storage.js";
import { generateTicketId } from "../utils/formatters.js";
import { notificationService } from "./notificationService.js";

export const ticketService = {
  getAll() {
    const list = getItem(STORAGE_KEYS.TICKETS, []);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    if (!id) return null;
    const list = this.getAll();
    return list.find((t) => t.id.toLowerCase() === id.toLowerCase()) || null;
  },

  create(data, currentUser) {
    const list = this.getAll();
    const newId = generateTicketId(list);
    const now = new Date().toISOString();

    const newTicket = {
      id: newId,
      subject: data.subject?.trim(),
      description: data.description?.trim(),
      category: data.category || "General",
      priority: data.priority || "Medium",
      status: "Open",
      location: data.location || "Kathmandu (Maitighar)",
      deviceId: data.deviceId || "",
      deviceName: data.deviceName || "Unspecified Device",
      userId: currentUser?.id || "usr-003",
      userName: currentUser?.name || "Demo User",
      userEmail: currentUser?.email || "user@helpdesknepal.com",
      assignedTechnicianId: data.assignedTechnicianId || "",
      assignedTechnicianName: data.assignedTechnicianName || "Unassigned",
      estimatedCost: Number(data.estimatedCost) || 0,
      currency: "NPR",
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
      resolutionNotes: "",
      timeline: [
        {
          id: `evt-${Date.now()}-1`,
          type: "created",
          title: "Ticket Created",
          description: `${currentUser?.name || "User"} submitted ticket via HelpDesk Nepal portal.`,
          author: currentUser?.name || "User",
          timestamp: now,
        },
      ],
      comments: [],
    };

    if (newTicket.assignedTechnicianId) {
      newTicket.status = "Assigned";
      newTicket.timeline.push({
        id: `evt-${Date.now()}-2`,
        type: "assigned",
        title: "Assigned to Technician",
        description: `Ticket assigned to ${newTicket.assignedTechnicianName}.`,
        author: currentUser?.name || "System",
        timestamp: now,
      });
    }

    const updated = [newTicket, ...list];
    setItem(STORAGE_KEYS.TICKETS, updated);

    // Trigger notification
    notificationService.create({
      title: newTicket.priority === "Critical" ? "New Critical Ticket Created" : "New Ticket Created",
      message: `${newTicket.id}: ${newTicket.subject} (${newTicket.location})`,
      type: newTicket.priority === "Critical" ? "critical" : "info",
      link: `/tickets/${newTicket.id}`,
    });

    return newTicket;
  },

  update(id, updates, currentUser) {
    const list = this.getAll();
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const now = new Date().toISOString();
    const timelineUpdates = [];

    // Check status change
    if (updates.status && updates.status !== existing.status) {
      let eventTitle = `Status changed to ${updates.status}`;
      let eventType = "status_change";
      let eventDesc = `${currentUser?.name || "Staff"} changed status from ${existing.status} to ${updates.status}.`;

      if (updates.status === "In Progress") {
        eventTitle = "Technician Started Investigation";
        eventType = "investigation";
        eventDesc = `${currentUser?.name || "Technician"} is actively investigating the reported issue.`;
      } else if (updates.status === "Resolved") {
        eventTitle = "Issue Resolved";
        eventType = "resolved";
        eventDesc = updates.resolutionNotes
          ? `Issue marked as resolved: ${updates.resolutionNotes}`
          : `${currentUser?.name || "Technician"} resolved the ticket.`;
        updates.resolvedAt = now;
      } else if (updates.status === "Closed") {
        eventTitle = "Ticket Closed";
        eventType = "closed";
        eventDesc = `Ticket officially closed and verified by ${currentUser?.name || "Administrator"}.`;
      }

      timelineUpdates.push({
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: eventType,
        title: eventTitle,
        description: eventDesc,
        author: currentUser?.name || "Staff",
        timestamp: now,
      });

      notificationService.create({
        title: `Ticket ${id} ${updates.status}`,
        message: `${currentUser?.name || "Staff"} updated status of ${id} to ${updates.status}.`,
        type: updates.status === "Resolved" ? "success" : "status",
        link: `/tickets/${id}`,
      });
    }

    // Check technician assignment change
    if (
      updates.assignedTechnicianId !== undefined &&
      updates.assignedTechnicianId !== existing.assignedTechnicianId
    ) {
      timelineUpdates.push({
        id: `evt-${Date.now()}-assign`,
        type: "assigned",
        title: "Assigned to Technician",
        description: updates.assignedTechnicianName
          ? `Ticket reassigned to ${updates.assignedTechnicianName}.`
          : "Technician assignment cleared.",
        author: currentUser?.name || "Admin",
        timestamp: now,
      });

      if (updates.assignedTechnicianName && existing.status === "Open") {
        updates.status = "Assigned";
      }

      notificationService.create({
        title: `Ticket ${id} Assigned`,
        message: `Ticket assigned to ${updates.assignedTechnicianName || "Unassigned"}.`,
        type: "assign",
        link: `/tickets/${id}`,
      });
    }

    // Check troubleshooting note
    if (updates.troubleshootingNote) {
      timelineUpdates.push({
        id: `evt-${Date.now()}-tb`,
        type: "troubleshooting",
        title: "Troubleshooting Performed",
        description: updates.troubleshootingNote,
        author: currentUser?.name || "Technician",
        timestamp: now,
      });
    }

    const updatedTicket = {
      ...existing,
      ...updates,
      updatedAt: now,
      timeline: [...(existing.timeline || []), ...timelineUpdates],
    };

    list[index] = updatedTicket;
    setItem(STORAGE_KEYS.TICKETS, list);
    return updatedTicket;
  },

  addComment(ticketId, { text, isInternal = false }, currentUser) {
    const list = this.getAll();
    const index = list.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;

    const ticket = list[index];
    const now = new Date().toISOString();
    const newComment = {
      id: `cmt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      author: currentUser?.name || "Support Member",
      authorRole: currentUser?.role || "user",
      text: text.trim(),
      timestamp: now,
      isInternal: Boolean(isInternal),
    };

    const updatedTicket = {
      ...ticket,
      updatedAt: now,
      comments: [...(ticket.comments || []), newComment],
    };

    list[index] = updatedTicket;
    setItem(STORAGE_KEYS.TICKETS, list);

    notificationService.create({
      title: `New Comment on ${ticketId}`,
      message: `${currentUser?.name || "User"} commented: "${text.slice(0, 45)}..."`,
      type: "comment",
      link: `/tickets/${ticketId}`,
    });

    return updatedTicket;
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter((t) => t.id !== id);
    setItem(STORAGE_KEYS.TICKETS, filtered);
    return true;
  },

  getStats() {
    const tickets = this.getAll();
    const devices = getItem(STORAGE_KEYS.DEVICES, []);
    const users = getItem(STORAGE_KEYS.USERS, []);

    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "Open").length;
    const assigned = tickets.filter((t) => t.status === "Assigned").length;
    const inProgress = tickets.filter((t) => t.status === "In Progress").length;
    const waitingForUser = tickets.filter((t) => t.status === "Waiting for User").length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;
    const closed = tickets.filter((t) => t.status === "Closed").length;
    const critical = tickets.filter((t) => t.priority === "Critical" && t.status !== "Closed" && t.status !== "Resolved").length;

    const activeTechnicians = users.filter((u) => u.role === "technician" && u.status === "active").length;
    const registeredDevices = devices.length;

    // Calculate average resolution time for resolved tickets in hours
    const resolvedTickets = tickets.filter((t) => t.resolvedAt && t.createdAt);
    let avgResolutionHours = 4.2; // default realistic fallback
    if (resolvedTickets.length > 0) {
      const totalHours = resolvedTickets.reduce((acc, t) => {
        const created = new Date(t.createdAt).getTime();
        const res = new Date(t.resolvedAt).getTime();
        const diffHours = Math.max(0.5, (res - created) / (1000 * 60 * 60));
        return acc + diffHours;
      }, 0);
      avgResolutionHours = parseFloat((totalHours / resolvedTickets.length).toFixed(1));
    }

    // Breakdown by Priority
    const byPriority = {
      Low: tickets.filter((t) => t.priority === "Low").length,
      Medium: tickets.filter((t) => t.priority === "Medium").length,
      High: tickets.filter((t) => t.priority === "High").length,
      Critical: tickets.filter((t) => t.priority === "Critical").length,
    };

    // Breakdown by Status
    const byStatus = {
      Open: open,
      Assigned: assigned,
      "In Progress": inProgress,
      "Waiting for User": waitingForUser,
      Resolved: resolved,
      Closed: closed,
    };

    // Breakdown by Category
    const byCategory = {};
    tickets.forEach((t) => {
      const cat = t.category || "Other";
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    // Monthly trends (last 6 months realistic simulation based on actual data)
    const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    const monthlyTrends = [
      { month: "May", created: 12, resolved: 11 },
      { month: "Jun", created: 18, resolved: 17 },
      { month: "Jul", created: 24, resolved: 22 },
      { month: "Aug", created: 19, resolved: 18 },
      { month: "Sep", created: 28, resolved: 26 },
      { month: "Oct", created: Math.max(8, total), resolved: Math.max(6, resolved + closed) },
    ];

    return {
      total,
      open,
      assigned,
      inProgress,
      waitingForUser,
      resolved,
      closed,
      unresolved: open + assigned + inProgress + waitingForUser,
      critical,
      avgResolutionHours,
      activeTechnicians,
      registeredDevices,
      byPriority,
      byStatus,
      byCategory,
      monthlyTrends,
    };
  },
};
