/**
 * Device Service for HelpDesk Nepal
 * Manages IT asset tracking, hardware specifications, and network addresses.
 */

import { getItem, setItem, STORAGE_KEYS } from "./storage.js";
import { generateDeviceId } from "../utils/formatters.js";
import { notificationService } from "./notificationService.js";

export const deviceService = {
  getAll() {
    const list = getItem(STORAGE_KEYS.DEVICES, []);
    return list;
  },

  getById(id) {
    if (!id) return null;
    const list = this.getAll();
    return list.find((d) => d.id.toLowerCase() === id.toLowerCase()) || null;
  },

  create(data) {
    const list = this.getAll();
    const newId = data.id && data.id.trim() ? data.id.trim() : generateDeviceId(list);

    const newDevice = {
      id: newId,
      name: data.name?.trim() || "Unnamed IT Device",
      type: data.type || "Desktop",
      brand: data.brand?.trim() || "Generic",
      model: data.model?.trim() || "Standard",
      serialNumber: data.serialNumber?.trim() || `SN-${Date.now().toString().slice(-6)}`,
      ipAddress: data.ipAddress?.trim() || "DHCP Dynamic",
      macAddress: data.macAddress?.trim() || "00:00:00:00:00:00",
      location: data.location || "Kathmandu (Central Hub)",
      assignedUser: data.assignedUser?.trim() || "Unassigned",
      status: data.status || "Active",
      os: data.os?.trim() || "Windows 11 / Linux",
      processor: data.processor?.trim() || "Standard CPU & RAM",
      purchaseDate: data.purchaseDate || new Date().toISOString().split("T")[0],
      warrantyUntil: data.warrantyUntil || "",
      notes: data.notes?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const updated = [newDevice, ...list];
    setItem(STORAGE_KEYS.DEVICES, updated);

    notificationService.create({
      title: "New Device Registered",
      message: `${newDevice.name} (${newDevice.id}) registered at ${newDevice.location}.`,
      type: "info",
      link: "/devices",
    });

    return newDevice;
  },

  update(id, updates) {
    const list = this.getAll();
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedDevice = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedDevice;
    setItem(STORAGE_KEYS.DEVICES, list);

    if (updates.status && updates.status !== existing.status) {
      notificationService.create({
        title: "Device Status Updated",
        message: `${existing.name} status changed to ${updates.status}.`,
        type: updates.status === "Maintenance" || updates.status === "Offline" ? "warning" : "info",
        link: "/devices",
      });
    }

    return updatedDevice;
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter((d) => d.id !== id);
    setItem(STORAGE_KEYS.DEVICES, filtered);
    return true;
  },

  getStats() {
    const devices = this.getAll();
    const total = devices.length;
    const active = devices.filter((d) => d.status === "Active").length;
    const maintenance = devices.filter((d) => d.status === "Maintenance").length;
    const offline = devices.filter((d) => d.status === "Offline").length;
    const retired = devices.filter((d) => d.status === "Retired").length;

    const byType = {};
    devices.forEach((d) => {
      byType[d.type] = (byType[d.type] || 0) + 1;
    });

    return {
      total,
      active,
      maintenance,
      offline,
      retired,
      byType,
    };
  },
};
