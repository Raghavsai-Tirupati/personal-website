"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/state/app-state";

// Anchored résumé text that carries a comment. Shows the rest-state yellow so
// it is discoverable without hover; clicking opens the aligned comment card.
export function CommentAnchor({
  commentId,
  children,
}: {
  commentId: string;
  children: ReactNode;
}) {
  const { activeComment, openComment, hoverComment, setHoverComment, versionOpen } = useApp();
  // In version-history mode comments are hidden, so render plain text.
  if (versionOpen) return <span>{children}</span>;
  return (
    <span
      id={`anchor-${commentId}`}
      data-comment-anchor={commentId}
      className="comment-anchor"
      data-active={activeComment === commentId ? "true" : undefined}
      data-hover={hoverComment === commentId ? "true" : undefined}
      role="button"
      tabIndex={0}
      aria-label="Open comment"
      onClick={() => openComment(commentId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openComment(commentId);
        }
      }}
      onMouseEnter={() => setHoverComment(commentId)}
      onMouseLeave={() => setHoverComment(null)}
    >
      {children}
    </span>
  );
}
