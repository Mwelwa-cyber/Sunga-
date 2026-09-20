export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function isSameDay(isoA: string, isoB: string) {
  return isoA.slice(0, 10) === isoB.slice(0, 10);
}

export function isSameMonth(iso: string, reference: Date = new Date()) {
  const d = new Date(iso);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth()
  );
}

export function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday as start of week
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysInMonth(date: Date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function formatDateLabel(iso: string) {
  const date = new Date(iso);
  const today = todayISO();
  const yesterday = isoDaysAgo(1);
  if (isSameDay(iso, today)) return "Today";
  if (isSameDay(iso, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-ZM", {
    day: "numeric",
    month: "short",
  });
}

export function formatTimeLabel(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-ZM", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getGreeting(date: Date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function daysUntil(iso: string) {
  const today = new Date(todayISO());
  const target = new Date(iso.slice(0, 10));
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDueLabel(iso: string) {
  const days = daysUntil(iso);
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days <= 7) return `Due in ${days} days`;
  if (days <= 13) return "Due next week";
  return `Due ${formatDateLabel(iso)}`;
}

export function addInterval(iso: string, frequency: "weekly" | "monthly" | "yearly") {
  const d = new Date(iso.slice(0, 10));
  if (frequency === "weekly") d.setDate(d.getDate() + 7);
  else if (frequency === "monthly") d.setMonth(d.getMonth() + 1);
  else d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}
