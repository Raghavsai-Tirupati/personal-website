"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppStateProvider, useApp } from "@/components/state/app-state";
import { TooltipProvider, ToastRegion } from "@/components/common/ui";
import { TitleBar } from "./title-bar";
import { MenuBar } from "./menu-bar";
import { Toolbar } from "./toolbar";
import { Ruler } from "./ruler";
import { TabsPanel } from "@/components/panels/tabs-panel";
import { CommentsLayer } from "@/components/panels/comments-layer";
import { NavDrawer } from "@/components/panels/nav-drawer";
import { CommentSheet } from "@/components/panels/comment-sheet";
import { VersionPanel, VersionHeader } from "@/components/panels/version-panel";
import { ShareDialog } from "@/components/dialogs/share-dialog";
import { ShortcutsDialog } from "@/components/dialogs/shortcuts-dialog";
import { WordCountDialog } from "@/components/dialogs/word-count-dialog";
import { MenuSearch } from "@/components/dialogs/menu-search";
import { FindBar } from "@/components/find/find-bar";
import { SelectionToolbar } from "@/components/resume/selection-toolbar";
import { cn } from "@/lib/utils";

// Global shortcuts that do not clash with the browser's own (⌘F left alone).
function KeyBindings() {
  const { openDialog } = useApp();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openDialog("menusearch");
      } else if (meta && e.key === "/") {
        e.preventDefault();
        openDialog("shortcuts");
      } else if (e.altKey && e.key === "/") {
        e.preventDefault();
        openDialog("menusearch");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openDialog]);
  return null;
}

function Chrome({ lastEditISO }: { lastEditISO: string }) {
  const { versionOpen } = useApp();
  return (
    <header className="no-print z-40 shrink-0 border-b border-line bg-chrome">
      {versionOpen ? (
        <VersionHeader />
      ) : (
        <>
          <TitleBar />
          {/* Menu bar, toolbar, and ruler collapse away on mobile. */}
          <div className="hidden md:block">
            <div className="flex items-center px-3 pb-1">
              <MenuBar lastEditISO={lastEditISO} />
            </div>
            <Toolbar />
            <Ruler />
          </div>
        </>
      )}
    </header>
  );
}

// Preserve #main scroll per route (back/forward restores; new tab starts top).
function useScrollRestore() {
  const pathname = usePathname();
  const positions = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => positions.current.set(pathname, main.scrollTop));
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    main.scrollTop = positions.current.get(pathname) ?? 0;
    return () => {
      main.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);
}

function Body({ children }: { children: ReactNode }) {
  const { view, versionOpen } = useApp();
  const isResume = usePathname() === "/";
  const showComments = view.comments && !versionOpen && isResume;
  useScrollRestore();
  return (
    <div className="flex min-h-0 flex-1">
      {view.tabs && (
        <aside className="no-print hidden w-[264px] shrink-0 overflow-y-auto border-r border-line bg-chrome docs-scroll md:block">
          <TabsPanel />
        </aside>
      )}

      <main
        id="main"
        tabIndex={0}
        role="region"
        aria-label="Document"
        className="relative min-w-0 flex-1 overflow-y-auto bg-canvas docs-scroll outline-none"
      >
        <div className={cn("relative", showComments && "xl:pr-[320px]")}>
          {children}
          {showComments && <CommentsLayer />}
        </div>
      </main>

      {versionOpen && (
        <aside className="no-print hidden w-[312px] shrink-0 overflow-y-auto border-l border-line bg-chrome docs-scroll lg:block">
          <VersionPanel />
        </aside>
      )}
    </div>
  );
}

export function AppShell({
  children,
  lastEditISO,
}: {
  children: ReactNode;
  lastEditISO: string;
}) {
  return (
    <AppStateProvider>
      <TooltipProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-[6px] focus:bg-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to document
        </a>
        <KeyBindings />
        <div className="flex h-[100dvh] flex-col">
          <Chrome lastEditISO={lastEditISO} />
          <Body>{children}</Body>
        </div>

        <NavDrawer />
        <CommentSheet />
        <ShareDialog />
        <ShortcutsDialog />
        <WordCountDialog />
        <MenuSearch />
        <FindBar />
        <SelectionToolbar />
        <ToastRegion />
      </TooltipProvider>
    </AppStateProvider>
  );
}
