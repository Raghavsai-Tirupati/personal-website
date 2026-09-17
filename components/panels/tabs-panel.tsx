"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TABS, TABS_BY_ID } from "@/lib/content";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

type OutlineItem = { id: string; label: string; sub?: boolean };

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function outlineFor(tabId: string): OutlineItem[] {
  if (tabId === "resume") {
    return [
      { id: "section-education", label: "Education" },
      { id: "section-experience", label: "Experience" },
      { id: "entry-brinks", label: "Brinks Home", sub: true },
      { id: "entry-clinicalhours", label: "ClinicalHours", sub: true },
      { id: "section-projects", label: "Projects" },
      { id: "entry-acsi", label: "ACSI", sub: true },
      { id: "entry-iris", label: "Iris", sub: true },
      { id: "entry-matchbook", label: "Matchbook", sub: true },
      { id: "section-skills", label: "Technical skills" },
    ];
  }
  const tab = TABS_BY_ID[tabId];
  if (!tab?.sections) return [];
  return tab.sections.map((s) => ({ id: `dd-${slug(s.heading)}`, label: s.heading }));
}

function activeTabId(pathname: string): string {
  if (pathname === "/") return "resume";
  const seg = pathname.slice(1);
  return TABS.some((t) => t.id === seg) ? seg : "resume";
}

export function TabsPanel({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = activeTabId(pathname);
  const outline = outlineFor(active);
  const [spy, setSpy] = useState<string | null>(null);

  // Scroll-spy over the current tab's headings within the #main scroll area.
  useEffect(() => {
    const root = document.getElementById("main");
    const targets = outline.map((o) => document.getElementById(o.id)).filter(Boolean) as HTMLElement[];
    if (!root || !targets.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setSpy(visible[0].target.id);
      },
      { root, rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label="Document tabs and outline" className="flex h-full flex-col px-3 py-3 text-[14px]">
      <div className="px-1 pb-1 text-[13px] font-medium text-ink-mute">Tabs</div>
      <ul className="space-y-0.5">
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <li key={t.id}>
              <Link
                href={t.route}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 transition-colors",
                  isActive ? "bg-[#c2e7ff66] font-medium text-[#062e6f]" : "text-ink-sub hover:bg-hover",
                )}
              >
                <Icon
                  name="description"
                  size={18}
                  className={isActive ? "text-blue" : "text-ink-mute"}
                />
                <span className="truncate">{t.label}</span>
              </Link>

              {/* Outline under the active tab */}
              {isActive && outline.length > 0 && (
                <ul className="mt-0.5 mb-1 ml-4 border-l border-line pl-2">
                  {outline.map((o) => {
                    const on = spy === o.id;
                    return (
                      <li key={o.id}>
                        <button
                          type="button"
                          onClick={() => go(o.id)}
                          className={cn(
                            "flex w-full items-center rounded-[6px] px-2 py-1 text-left text-[13px] transition-colors hover:bg-hover",
                            o.sub ? "pl-5 text-ink-mute" : "text-ink-sub",
                            on && "font-medium text-blue",
                          )}
                        >
                          <span className="truncate">{o.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
