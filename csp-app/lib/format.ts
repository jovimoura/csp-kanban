import type { TaskStatus, UserProfile } from "@/lib/types";

export const STATUS_META: Record<
  TaskStatus,
  {
    label: string;
    columnClass: string;
    dotClass: string;
    badgeClass: string;
  }
> = {
  not_started: {
    label: "Não Iniciada",
    columnClass: "bg-column-not-started",
    dotClass: "bg-column-not-started-dot",
    badgeClass: "bg-primary/50 text-primary-foreground",
  },
  in_progress: {
    label: "Em andamento",
    columnClass: "bg-column-in-progress",
    dotClass: "bg-column-in-progress-dot",
    badgeClass: "bg-column-in-progress text-column-in-progress-dot",
  },
  paused: {
    label: "Pausada",
    columnClass: "bg-column-paused",
    dotClass: "bg-column-paused-dot",
    badgeClass: "bg-column-paused text-column-paused-dot",
  },
  homolog: {
    label: "Em Homologação",
    columnClass: "bg-column-homolog",
    dotClass: "bg-column-homolog-dot",
    badgeClass: "bg-column-homolog text-column-homolog-dot",
  },
  prod: {
    label: "Em Produção",
    columnClass: "bg-column-prod",
    dotClass: "bg-column-prod-dot",
    badgeClass: "bg-column-prod text-column-prod-dot",
  },
};

export const PROFILE_LABELS: Record<UserProfile, string> = {
  admin: "Admin",
  developer: "Developer",
  agile: "Agile",
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function emailFromName(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  return `${slug || "usuario"}@csp.tech`;
}

export function formatDueDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function isOverdue(isoDate: string) {
  const due = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}
