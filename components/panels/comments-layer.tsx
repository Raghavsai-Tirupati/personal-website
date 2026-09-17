"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { commentsForTab, TABS_BY_ID } from "@/lib/content";
import { useApp } from "@/components/state/app-state";
import { Chip } from "@/components/resume/chip";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const CARD_GAP = 12;

// Constant content; computed once so the layout effect has stable deps.
const RESUME_COMMENTS = commentsForTab("resume");

function shallowEqual(a: Record<string, number>, b: Record<string, number>) {
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => a[k] === b[k]);
}

// Right-margin comment cards, aligned to their anchors and stacked to avoid
// overlap, the way Docs lays them out. Lives inside the #main scroll flow so
// cards scroll with the document.
export function CommentsLayer() {
  const { activeComment, openComment, hoverComment, setHoverComment, layoutNonce, version } = useApp();
  const comments = RESUME_COMMENTS;
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [tops, setTops] = useState<Record<string, number>>({});

  const recompute = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapTop = wrap.getBoundingClientRect().top;
    const measured = comments
      .map((c) => {
        const anchor = document.getElementById(`anchor-${c.id}`);
        if (!anchor) return null;
        const at = anchor.getBoundingClientRect().top - wrapTop;
        const h = cardRefs.current[c.id]?.offsetHeight ?? 128;
        return { id: c.id, anchorTop: at, h };
      })
      .filter(Boolean) as { id: string; anchorTop: number; h: number }[];
    measured.sort((a, b) => a.anchorTop - b.anchorTop);

    // If a card is active, let it sit exactly at its anchor and flow others.
    let cursor = -Infinity;
    const next: Record<string, number> = {};
    for (const m of measured) {
      const top = Math.max(m.anchorTop, cursor);
      next[m.id] = top;
      cursor = top + m.h + CARD_GAP;
    }
    setTops((prev) => (shallowEqual(prev, next) ? prev : next));
  }, [comments]);

  // Recompute before paint on any layout-affecting change.
  useLayoutEffect(() => {
    recompute();
    const onResize = () => recompute();
    window.addEventListener("resize", onResize);
    const page = document.querySelector("[data-page]");
    const ro = page ? new ResizeObserver(() => recompute()) : null;
    if (page && ro) ro.observe(page);
    // fonts can shift layout after load
    const t = setTimeout(recompute, 300);
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      clearTimeout(t);
    };
  }, [recompute, layoutNonce, activeComment, version]);

  if (!comments.length) return null;

  return (
    <div
      ref={wrapRef}
      aria-label="Comments"
      className="no-print pointer-events-none absolute right-0 top-0 bottom-0 hidden w-[300px] xl:block"
    >
      {comments.map((c) => {
        const active = activeComment === c.id;
        const top = tops[c.id];
        const tab = c.openTab ? TABS_BY_ID[c.openTab] : null;
        return (
          <div
            key={c.id}
            ref={(el) => {
              cardRefs.current[c.id] = el;
            }}
            data-comment-card={c.id}
            onMouseEnter={() => setHoverComment(c.id)}
            onMouseLeave={() => setHoverComment(null)}
            onClick={() => openComment(c.id)}
            style={{ top, visibility: top == null ? "hidden" : "visible" }}
            className={cn(
              "pointer-events-auto absolute w-[288px] cursor-pointer rounded-[8px] border bg-white p-3 transition-[transform,box-shadow,border-color] duration-150",
              active
                ? "z-10 -translate-x-2 border-transparent shadow-[var(--shadow-menu)]"
                : "border-line shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-menu)]",
              hoverComment === c.id && !active && "border-[#fddb6b]",
            )}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
                style={{ background: c.authorColor }}
                aria-hidden
              >
                RT
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-ink">{c.author}</div>
                <div className="text-[11px] text-ink-mute">{c.dateLabel}</div>
              </div>
            </div>
            <p className="text-[13px] leading-[1.45] text-ink-sub">{c.body}</p>
            {(c.chips?.length || tab) && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {c.chips?.map((id) => <Chip key={id} id={id} />)}
                {tab && (
                  <Link
                    href={tab.route}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[12px] font-medium text-blue transition-colors hover:bg-[#0b57d014]"
                  >
                    Open tab
                    <Icon name="open_in_new" size={13} />
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
