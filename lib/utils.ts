import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format an ISO date (YYYY-MM-DD) as Docs shows it, e.g. "July 20, 2026".
export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

// "Month YYYY" grouping label used by version history.
export function monthLabel(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${y}`;
}

// Relative phrasing for "Last edit was N days ago", matching Docs wording.
export function relativeEdit(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const days = Math.floor((now.getTime() - then.getTime()) / 86_400_000);
  if (days <= 0) return "Last edit was today";
  if (days === 1) return "Last edit was yesterday";
  if (days < 7) return `Last edit was ${days} days ago`;
  if (days < 14) return "Last edit was 1 week ago";
  if (days < 30) return `Last edit was ${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "Last edit was 1 month ago";
  return `Last edit was ${Math.floor(days / 30)} months ago`;
}
