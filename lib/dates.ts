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
