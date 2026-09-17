"use client";

import * as RDialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COMMENTS_BY_ID, commentsForTab, TABS_BY_ID } from "@/lib/content";
import { useApp } from "@/components/state/app-state";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/resume/chip";

const RESUME_COMMENTS = commentsForTab("resume");

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1279px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

// Mobile comment viewer as a bottom sheet: drag handle, swipe-to-dismiss,
// Escape, and a close button. Prev/next move between threads.
export function CommentSheet() {
  const { activeComment, openComment, closeComment } = useApp();
  const isMobile = useIsMobile();
  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);

  const open = isMobile && activeComment !== null;
  const c = activeComment ? COMMENTS_BY_ID[activeComment] : null;
  const index = RESUME_COMMENTS.findIndex((x) => x.id === activeComment);
  const tab = c?.openTab ? TABS_BY_ID[c.openTab] : null;

  useEffect(() => {
    if (!open) setDragY(0);
  }, [open]);

  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current == null) return;
    setDragY(Math.max(0, e.clientY - startY.current));
  };
  const onPointerUp = () => {
    if (dragY > 90) closeComment();
    startY.current = null;
    setDragY(0);
  };

  return (
    <RDialog.Root open={open} onOpenChange={(o) => !o && closeComment()}>
      <RDialog.Portal>
        <RDialog.Overlay className="no-print fixed inset-0 z-[97] bg-black/40 data-[state=open]:animate-[overlayIn_150ms_ease-out]" />
        <RDialog.Content
          aria-label="Comment"
          className="no-print fixed inset-x-0 bottom-0 z-[98] rounded-t-[16px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-dialog)] data-[state=open]:animate-[sheetUp_260ms_cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: dragY ? `translateY(${dragY}px)` : undefined, transition: startY.current == null ? "transform 200ms ease-out" : "none" }}
        >
          <div
            className="flex cursor-grab touch-none justify-center pt-2.5 pb-1 active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <span className="h-1.5 w-10 rounded-full bg-[#c7c7c7]" aria-hidden />
          </div>

          {c && (
            <div className="px-5 pb-6">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-full text-[12px] font-semibold text-white" style={{ background: c.authorColor }} aria-hidden>
                  RT
                </span>
                <div className="flex-1">
                  <RDialog.Title className="text-[14px] font-medium text-ink">{c.author}</RDialog.Title>
                  <div className="text-[12px] text-ink-mute">{c.dateLabel}</div>
                </div>
                <RDialog.Close aria-label="Close" className="grid size-9 place-items-center rounded-full text-ink-mute hover:bg-hover">
                  <Icon name="close" size={22} />
                </RDialog.Close>
              </div>

              <p className="text-[15px] leading-[1.55] text-ink-sub">{c.body}</p>

              {(c.chips?.length || tab) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {c.chips?.map((id) => <Chip key={id} id={id} />)}
                  {tab && (
                    <Link href={tab.route} onClick={() => closeComment()} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-medium text-blue">
                      Open tab
                      <Icon name="open_in_new" size={14} />
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3">
                <button
                  type="button"
                  disabled={index <= 0}
                  onClick={() => openComment(RESUME_COMMENTS[index - 1].id)}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] text-ink-sub hover:bg-hover disabled:text-[#bdc1c6]"
                >
                  <Icon name="chevron_left" size={18} /> Previous
                </button>
                <span className="text-[12px] text-ink-mute">
                  {index + 1} of {RESUME_COMMENTS.length}
                </span>
                <button
                  type="button"
                  disabled={index >= RESUME_COMMENTS.length - 1}
                  onClick={() => openComment(RESUME_COMMENTS[index + 1].id)}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] text-ink-sub hover:bg-hover disabled:text-[#bdc1c6]"
                >
                  Next <Icon name="chevron_right" size={18} />
                </button>
              </div>
            </div>
          )}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
