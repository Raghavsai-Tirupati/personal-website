import "server-only";
import { execSync } from "node:child_process";

// Latest commit date at build time, used for the Docs "Last edit was ..." label.
// Falls back to the build timestamp if git is unavailable.
export function getLastEditISO(): string {
  try {
    const out = execSync("git log -1 --format=%cI", {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (out) return out;
  } catch {
    // no git history available
  }
  return new Date().toISOString();
}
