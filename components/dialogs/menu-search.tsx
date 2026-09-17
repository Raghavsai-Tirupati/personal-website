"use client";

import * as RDialog from "@radix-ui/react-dialog";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";
import { useApp } from "@/components/state/app-state";
import { OWNER, DOC_TITLE } from "@/lib/config";
import { TABS } from "@/lib/content";
import { cn } from "@/lib/utils";

type Command = { id: string; label: string; hint?: string; icon: IconName; keywords?: string; run: () => void };

export function MenuSearch() {
  const { dialog, closeDialog, openDialog, openVersionHistory, setFindOpen, toggleView, view, setView, pushToast } =
    useApp();
  const router = useRouter();
  const open = dialog === "menusearch";
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const copy = async (text: string, toast: string) => {
    try {
      await navigator.clipboard.writeText(text);
      pushToast(toast);
    } catch {
      pushToast("Copy failed");
    }
  };

  const commands = useMemo<Command[]>(() => {
    const close = closeDialog;
    const c: Command[] = [
      { id: "share", label: "Share", icon: "person", keywords: "share link", run: () => { close(); openDialog("share"); } },
      { id: "email", label: "Copy email address", icon: "mail", keywords: "contact", run: () => { close(); copy(OWNER.email, "Email address copied"); } },
      { id: "copylink", label: "Copy link to current tab", icon: "link", run: () => { close(); copy(window.location.href, "Link copied"); } },
      { id: "version", label: "See version history", icon: "history", keywords: "timeline career", run: () => { close(); openVersionHistory(); } },
      { id: "print", label: "Print", icon: "print", hint: "⌘P", run: () => { close(); window.print(); } },
      { id: "find", label: "Find in document", icon: "search", run: () => { close(); setFindOpen(true); } },
      { id: "comments", label: view.comments ? "Hide comments" : "Show comments", icon: "add_comment", run: () => { close(); toggleView("comments"); } },
      { id: "ruler", label: view.ruler ? "Hide ruler" : "Show ruler", icon: "text_fields", run: () => { close(); toggleView("ruler"); } },
      { id: "tabs", label: view.tabs ? "Hide tabs & outline" : "Show tabs & outline", icon: "grid_view", run: () => { close(); toggleView("tabs"); } },
      { id: "pageless", label: view.pageless ? "Turn off Pageless" : "Turn on Pageless", icon: "description", run: () => { close(); toggleView("pageless"); } },
      { id: "zoom-in", label: "Zoom to 125%", icon: "zoom_in", keywords: "zoom", run: () => { close(); setView({ zoom: 125 }); } },
      { id: "zoom-reset", label: "Zoom to 100%", icon: "zoom_in", keywords: "zoom reset fit", run: () => { close(); setView({ zoom: 100 }); } },
      { id: "wordcount", label: "Word count", icon: "format_list_bulleted", keywords: "tools", run: () => { close(); openDialog("wordcount"); } },
      { id: "shortcuts", label: "Keyboard shortcuts", icon: "grid_view", hint: "⌘/", run: () => { close(); openDialog("shortcuts"); } },
    ];
    for (const t of TABS) {
      c.push({
        id: `go-${t.id}`,
        label: `Go to ${t.label}`,
        icon: "description",
        keywords: "tab open navigate",
        run: () => { close(); router.push(t.route); },
      });
    }
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, closeDialog, openDialog, openVersionHistory, setFindOpen, toggleView, setView, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((cmd) => (cmd.label + " " + (cmd.keywords ?? "")).toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <RDialog.Root open={open} onOpenChange={(o) => !o && closeDialog()}>
      <RDialog.Portal>
        <RDialog.Overlay className="no-print fixed inset-0 z-[100] bg-black/25 data-[state=open]:animate-[overlayIn_120ms_ease-out]" />
        <RDialog.Content
          aria-label="Search the menus"
          className="no-print fixed left-1/2 top-[12vh] z-[101] w-[min(92vw,560px)] -translate-x-1/2 overflow-hidden rounded-[10px] bg-white shadow-[var(--shadow-dialog)] focus:outline-none data-[state=open]:animate-[popIn_130ms_ease-out]"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); results[active]?.run(); }
          }}
        >
          <RDialog.Title className="sr-only">Search the menus</RDialog.Title>
          <div className="flex items-center gap-2 border-b border-line px-4">
            <Icon name="search" size={20} className="text-ink-mute" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menus"
              aria-label="Search the menus"
              className="flex-1 bg-transparent py-3.5 text-[15px] text-ink outline-none placeholder:text-ink-faint"
            />
          </div>
          <ul ref={listRef} className="max-h-[52vh] overflow-y-auto py-1.5 docs-scroll">
            {results.length === 0 && (
              <li className="px-4 py-6 text-center text-[14px] text-ink-mute">No matching menu items</li>
            )}
            {results.map((cmd, i) => (
              <li key={cmd.id}>
                <button
                  type="button"
                  onMouseMove={() => setActive(i)}
                  onClick={() => cmd.run()}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-ink",
                    i === active && "bg-hover",
                  )}
                >
                  <Icon name={cmd.icon} size={19} className="text-ink-mute" />
                  <span className="flex-1">{cmd.label}</span>
                  {cmd.hint && <span className="text-[12px] text-ink-faint">{cmd.hint}</span>}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-4 py-2 text-[12px] text-ink-faint">
            {DOC_TITLE}
          </div>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
