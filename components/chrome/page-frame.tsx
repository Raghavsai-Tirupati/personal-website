"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/state/app-state";
import { cn } from "@/lib/utils";

// The white letter sheet (paged) or the borderless reading surface (pageless).
// Zoom uses the CSS `zoom` property so layout reflows and scrolling stays
// natural, matching how Docs scales the page.
export function PageFrame({
  children,
  className,
  variant = "resume",
}: {
  children: ReactNode;
  className?: string;
  variant?: "resume" | "deep-dive";
}) {
  const { view } = useApp();
  // Deep-dive tabs are pageless by default; the résumé follows the View toggle.
  const pageless = view.pageless || variant === "deep-dive";

  return (
    <div
      className={cn("flex w-full justify-center", pageless ? "px-4 py-8" : "px-4 py-9")}
      style={{ zoom: view.zoom / 100 }}
    >
      <article
        data-page
        className={cn(
          "print-page w-full bg-white text-ink animate-[fadeIn_160ms_ease-out]",
          pageless
            ? "max-w-[720px] px-1 py-2 sm:px-2"
            : "min-h-[1056px] px-7 py-9 shadow-[var(--shadow-page)] max-w-[var(--page-w)] sm:px-12 md:px-[var(--page-pad-x)] md:py-[var(--page-pad-y)]",
          className,
        )}
      >
        {children}
      </article>
    </div>
  );
}
