"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { useApp } from "@/components/state/app-state";

// Find-in-document using the CSS Custom Highlight API. Does not touch the
// browser's native Cmd/Ctrl+F; it opens from the Edit menu.
type Hl = { new (...ranges: Range[]): Highlight };

export function FindBar() {
  const { findOpen, setFindOpen } = useApp();
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState(0);
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rangesRef = useRef<Range[]>([]);

  const supported = typeof window !== "undefined" && "highlights" in CSS && typeof Highlight !== "undefined";

  const clear = useCallback(() => {
    if (supported) {
      CSS.highlights.delete("find-match");
      CSS.highlights.delete("find-current");
    }
    rangesRef.current = [];
    setMatches(0);
    setIndex(0);
  }, [supported]);

  const run = useCallback(
    (q: string, activeIndex: number) => {
      if (!supported) return;
      CSS.highlights.delete("find-match");
      CSS.highlights.delete("find-current");
      rangesRef.current = [];
      const root = document.querySelector<HTMLElement>("[data-page]");
      if (!root || q.trim().length === 0) {
        setMatches(0);
        return;
      }
      const needle = q.toLowerCase();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const ranges: Range[] = [];
      let node: Node | null;
      // eslint-disable-next-line no-cond-assign
      while ((node = walker.nextNode())) {
        const text = node.nodeValue ?? "";
        const hay = text.toLowerCase();
        let from = 0;
        let i = hay.indexOf(needle, from);
        while (i !== -1) {
          const r = document.createRange();
          r.setStart(node, i);
          r.setEnd(node, i + needle.length);
          ranges.push(r);
          from = i + needle.length;
          i = hay.indexOf(needle, from);
        }
      }
      rangesRef.current = ranges;
      setMatches(ranges.length);
      if (!ranges.length) return;
      const HighlightCtor = Highlight as unknown as Hl;
      const active = Math.min(activeIndex, ranges.length - 1);
      const others = ranges.filter((_, k) => k !== active);
      if (others.length) CSS.highlights.set("find-match", new HighlightCtor(...others));
      CSS.highlights.set("find-current", new HighlightCtor(ranges[active]));
      ranges[active].startContainer.parentElement?.scrollIntoView({ block: "center", behavior: "smooth" });
    },
    [supported],
  );

  // Recompute on query change.
  useEffect(() => {
    if (!findOpen) return;
    setIndex(0);
    run(query, 0);
  }, [query, findOpen, run]);

  // Focus when opened; clear when closed.
  useEffect(() => {
    if (findOpen) {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else {
      clear();
      setQuery("");
    }
  }, [findOpen, clear]);

  const step = (dir: 1 | -1) => {
    if (matches === 0) return;
    const next = (index + dir + matches) % matches;
    setIndex(next);
    run(query, next);
  };

  if (!findOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Find in document"
      className="no-print fixed right-4 top-[150px] z-[85] flex items-center gap-1 rounded-[8px] border border-line bg-white px-2 py-1.5 shadow-[var(--shadow-menu)] animate-[popIn_120ms_ease-out]"
    >
      <Icon name="search" size={18} className="ml-1 text-ink-mute" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            step(e.shiftKey ? -1 : 1);
          } else if (e.key === "Escape") {
            e.preventDefault();
            setFindOpen(false);
          }
        }}
        placeholder="Find in document"
        aria-label="Find in document"
        className="w-44 bg-transparent px-1.5 py-1 text-[14px] text-ink outline-none placeholder:text-ink-faint"
      />
      <span className="min-w-12 px-1 text-center text-[12px] tabular-nums text-ink-mute">
        {matches ? `${index + 1} / ${matches}` : "0 / 0"}
      </span>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous match"
        disabled={matches === 0}
        className="grid size-7 place-items-center rounded-full text-ink-sub transition-colors hover:bg-hover disabled:text-[#bdc1c6]"
      >
        <Icon name="keyboard_arrow_up" size={20} />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next match"
        disabled={matches === 0}
        className="grid size-7 place-items-center rounded-full text-ink-sub transition-colors hover:bg-hover disabled:text-[#bdc1c6]"
      >
        <Icon name="keyboard_arrow_down" size={20} />
      </button>
      <span className="mx-0.5 h-5 w-px bg-line" />
      <button
        type="button"
        onClick={() => setFindOpen(false)}
        aria-label="Close find bar"
        className="grid size-7 place-items-center rounded-full text-ink-sub transition-colors hover:bg-hover"
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}
