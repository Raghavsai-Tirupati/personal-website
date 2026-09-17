"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { useApp } from "@/components/state/app-state";

type Pos = { x: number; y: number; text: string } | null;

// Floating action shown when a visitor selects résumé text. One honest action:
// copy a link with a :~:text= fragment that re-highlights the passage on load.
export function SelectionToolbar() {
  const { pushToast } = useApp();
  const [pos, setPos] = useState<Pos>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setPos(null);
        return;
      }
      const text = sel.toString().trim();
      const node = sel.anchorNode;
      const page = document.querySelector("[data-page]");
      if (!text || text.length < 3 || !node || !page || !page.contains(node)) {
        setPos(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top, text });
    };

    const onMouseUp = () => setTimeout(update, 0);
    const onKeyUp = () => setTimeout(update, 0);
    const onScroll = () => setPos(null);
    const onMouseDown = (e: MouseEvent) => {
      if (barRef.current?.contains(e.target as Node)) return;
      setPos(null);
    };
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousedown", onMouseDown);
    const main = document.getElementById("main");
    main?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousedown", onMouseDown);
      main?.removeEventListener("scroll", onScroll);
    };
  }, []);

  const copy = async () => {
    if (!pos) return;
    // Build a robust text fragment: exact text if short, else start,end.
    const words = pos.text.split(/\s+/);
    let fragment: string;
    if (pos.text.length <= 55 || words.length <= 6) {
      fragment = encodeURIComponent(pos.text);
    } else {
      const start = words.slice(0, 3).join(" ");
      const end = words.slice(-3).join(" ");
      fragment = `${encodeURIComponent(start)},${encodeURIComponent(end)}`;
    }
    const url = `${window.location.origin}${window.location.pathname}#:~:text=${fragment}`;
    try {
      await navigator.clipboard.writeText(url);
      pushToast("Link to highlight copied");
    } catch {
      pushToast("Copy failed");
    }
    setPos(null);
    window.getSelection()?.removeAllRanges();
  };

  if (!pos) return null;

  return (
    <div
      ref={barRef}
      className="no-print fixed z-[86] -translate-x-1/2 -translate-y-full pb-2"
      style={{ left: pos.x, top: pos.y }}
    >
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 rounded-[8px] bg-[#3c4043] px-3 py-2 text-[13px] font-medium text-white shadow-[var(--shadow-menu)] transition-transform active:scale-[0.97] animate-[popIn_120ms_ease-out]"
      >
        <Icon name="link" size={16} />
        Copy link to highlight
      </button>
    </div>
  );
}
