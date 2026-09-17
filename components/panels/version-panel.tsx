"use client";

import { useEffect, useMemo, useRef } from "react";
import { VERSIONS, type Version } from "@/lib/content";
import { OWNER } from "@/lib/config";
import { useApp } from "@/components/state/app-state";
import { Icon } from "@/components/icon";
import { formatLongDate, monthLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Row = { id: string | null; title: string; date: string; dateTodo?: boolean };

// Flat, newest-first list: a synthetic "Current version" then each milestone.
function buildRows(today: string): Row[] {
  const rows: Row[] = [{ id: null, title: "Current version", date: today }];
  for (const v of [...VERSIONS].reverse()) {
    rows.push({ id: v.id, title: v.title, date: v.id, dateTodo: v.dateTodo });
  }
  return rows;
}

export function VersionHeader() {
  const { closeVersionHistory, version } = useApp();
  const current = version ? VERSIONS.find((v: Version) => v.id === version) : null;
  return (
    <div className="flex items-center gap-2 px-3 py-3">
      <button
        type="button"
        onClick={closeVersionHistory}
        aria-label="Back to current version"
        className="grid size-10 place-items-center rounded-full text-ink-sub transition-colors hover:bg-hover active:scale-95"
      >
        <Icon name="arrow_back" size={24} />
      </button>
      <div className="min-w-0">
        <h1 className="truncate text-[18px] leading-tight text-ink">Version history</h1>
        <p className="truncate text-[12px] text-ink-mute">
          {current ? current.title : "Viewing the current version"}
        </p>
      </div>
      <button
        type="button"
        onClick={closeVersionHistory}
        className="ml-auto rounded-full border border-[#747775] px-4 py-1.5 text-[13px] font-medium text-blue transition-colors hover:bg-[#0b57d014]"
      >
        Back to current version
      </button>
    </div>
  );
}

export function VersionPanel() {
  const { version, setVersion } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const rows = useMemo(() => buildRows(today), [today]);
  const listRef = useRef<HTMLDivElement>(null);

  const activeIndex = rows.findIndex((r) => r.id === version);

  // Arrow keys move between versions.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowDown", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const next = Math.min(activeIndex + 1, rows.length - 1);
        setVersion(rows[next].id);
      } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        const next = Math.max(activeIndex - 1, 0);
        setVersion(rows[next].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, rows, setVersion]);

  // Group rows by month label for Docs-style section headers.
  const groups: { label: string; rows: Row[] }[] = [];
  for (const r of rows) {
    const label = r.id === null ? "Today" : monthLabel(r.id);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.rows.push(r);
    else groups.push({ label, rows: [r] });
  }

  return (
    <div ref={listRef} className="py-2">
      {groups.map((g) => (
        <div key={g.label} className="mb-1">
          <div className="px-4 py-2 text-[12px] font-medium text-ink-mute">{g.label}</div>
          <ul>
            {g.rows.map((r) => {
              const selected = r.id === version;
              return (
                <li key={r.id ?? "current"}>
                  <button
                    type="button"
                    onClick={() => setVersion(r.id)}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      "flex w-full items-start gap-2.5 border-l-[3px] px-3.5 py-2.5 text-left transition-colors",
                      selected
                        ? "border-blue bg-[#c2e7ff40]"
                        : "border-transparent hover:bg-hover",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-[14px]", selected ? "font-semibold text-ink" : "font-medium text-ink")}>
                        {r.id === null ? "Current version" : formatLongDate(r.id)}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-sub">
                        {r.id === null ? "Latest edits" : r.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[11.5px] text-ink-mute">
                        <span className="inline-block size-2 rounded-full" style={{ background: OWNER.color }} aria-hidden />
                        {OWNER.name}
                        {r.dateTodo && <span className="text-ink-faint">· date TBD</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
