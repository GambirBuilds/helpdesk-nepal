/**
 * Utility formatters for HelpDesk Nepal
 */

export function formatNPR(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return "Rs. 0";
  }
  const num = Number(amount);
  return `Rs. ${num.toLocaleString("en-IN")}`;
}

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDateOnly(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function generateTicketId(existingTickets = []) {
  const currentYear = new Date().getFullYear();
  const prefix = `HDN-${currentYear}-`;

  let maxNum = 0;
  existingTickets.forEach((t) => {
    if (t.id && t.id.startsWith(prefix)) {
      const parts = t.id.split("-");
      const num = parseInt(parts[2], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `${prefix}${String(nextNum).padStart(4, "0")}`;
}

export function generateDeviceId(existingDevices = []) {
  let maxNum = 0;
  existingDevices.forEach((d) => {
    if (d.id) {
      const match = d.id.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  const nextNum = maxNum + 1;
  return `DEV-NP-${String(nextNum).padStart(3, "0")}`;
}
