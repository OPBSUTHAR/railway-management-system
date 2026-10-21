const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function todayISO() {
  return toISO(new Date());
}

export function toISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISO(value) {
  if (!value) return new Date();
  const dateOnly = String(value).slice(0, 10);
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(value, days) {
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function formatDate(value, options = {}) {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatShortDate(value) {
  return formatDate(value, { weekday: undefined, year: undefined });
}

export function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return "—";
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
}

export function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatTime12(time) {
  if (!time || time === "—") return time || "—";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalized = hours % 12 || 12;
  return `${normalized}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function daysLabel(days) {
  if (days === "daily") return "Daily";
  if (!Array.isArray(days)) return "Daily";
  if (days.length === 7) return "Daily";
  return days.map((day) => DAY_NAMES[day]).join(" · ");
}

export function runsOn(days, dateISOValue) {
  if (days === "daily") return true;
  if (!Array.isArray(days)) return true;
  return days.includes(parseISO(dateISOValue).getDay());
}

export function dayOffsetLabel(offset) {
  if (!offset) return "";
  return `+${offset}`;
}

export function nowTimeLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}
