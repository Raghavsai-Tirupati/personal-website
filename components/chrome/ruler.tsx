"use client";

import { useApp } from "@/components/state/app-state";

// Thin horizontal ruler above the page, with left/right margin markers and
// inch ticks. Purely a faithful chrome detail; hidden in pageless mode.
export function Ruler() {
  const { view } = useApp();
  if (!view.ruler || view.pageless) return null;

  const inch = 96;
  const marginIn = 84 / inch; // page padding in inches
  const ticks = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="no-print hidden justify-center pb-1 md:flex" aria-hidden>
      <div
        className="relative h-[14px] rounded-[2px]"
        style={{ width: "var(--page-w)", zoom: view.zoom / 100 }}
      >
        {/* margin fill */}
        <div className="absolute inset-0 rounded-[2px] bg-[#c8ccd0]" />
        <div
          className="absolute top-0 bottom-0 bg-white"
          style={{ left: marginIn * inch, right: marginIn * inch }}
        />
        {/* inch ticks */}
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute top-1/2 h-[3px] w-px -translate-y-1/2 bg-[#9aa0a6]"
            style={{ left: t * inch }}
          />
        ))}
        {/* left/right margin triangles */}
        <div
          className="absolute top-0 size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#5f6368]"
          style={{ left: marginIn * inch - 5 }}
        />
        <div
          className="absolute top-0 size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#5f6368]"
          style={{ right: marginIn * inch - 5 }}
        />
      </div>
    </div>
  );
}
