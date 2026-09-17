import type { Version } from "./types";

// Career timeline as Docs "versions". Ordered oldest -> newest. Each id is an
// ISO date and doubles as the ?version= URL value. Dates flagged `dateTodo`
// are placeholders to confirm (listed in the build TODO report).
export const VERSIONS: Version[] = [
  { id: "2025-08-18", title: "Started at Texas A&M", dateTodo: true },
  { id: "2025-10-01", title: "Founded ClinicalHours", dateTodo: true },
  { id: "2025-10-25", title: "Best Use of Gemini API at TidalHack", dateTodo: true },
  { id: "2025-11-08", title: "Won 1st place at Hook 'Em Hacks with Iris", dateTodo: true },
  { id: "2026-01-15", title: "Built Matchbook Trade Engine", dateTodo: true },
  { id: "2026-05-18", title: "Joined Brinks Home", dateTodo: true },
  { id: "2026-07-16", title: "ACSI first commit" },
  { id: "2026-07-20", title: "First ACSI certificate issued" },
  { id: "2026-08-25", title: "Continued at Brinks part-time", dateTodo: true },
];

// Convenience: the earliest date is the résumé's baseline.
export const BASELINE_DATE = VERSIONS[0].id;

export function isValidVersion(id: string | null | undefined): id is string {
  return !!id && VERSIONS.some((v) => v.id === id);
}
