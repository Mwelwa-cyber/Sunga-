export function todayISO() {
  return localDateISO(new Date());
}

function localDateISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return localDateISO(d);
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
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  const d = new Date(year, month - 1, day);
  if (frequency === "weekly") d.setDate(d.getDate() + 7);
  else if (frequency === "monthly") {
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
  } else {
    d.setDate(1);
    d.setFullYear(d.getFullYear() + 1);
    const lastDay = new Date(d.getFullYear(), month, 0).getDate();
    d.setMonth(month - 1, Math.min(day, lastDay));
  }
  return localDateISO(d);
}

export function nextDueDateAfterPayment(
  dueDate: string,
  frequency: "weekly" | "monthly" | "yearly",
  paidDate: string
) {
  let next = addInterval(dueDate, frequency);
  while (next <= paidDate.slice(0, 10)) {
    next = addInterval(next, frequency);
  }
  return next;
}
