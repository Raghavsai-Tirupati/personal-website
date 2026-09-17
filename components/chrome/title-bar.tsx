"use client";

import Link from "next/link";
import { DOC_TITLE } from "@/lib/config";
import { DocMark } from "@/components/brand";
import { Icon } from "@/components/icon";
import { IconButton, Tooltip } from "@/components/common/ui";
import { useApp } from "@/components/state/app-state";
import { commentsForTab } from "@/lib/content";
import { Presence } from "./presence";

export function TitleBar() {
  const { starred, toggleStar, openVersionHistory, openDialog, toggleView, view, setNavOpen, openComment } = useApp();
  const resumeComments = commentsForTab("resume");
  const commentCount = resumeComments.length;

  const onCommentClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      openComment(resumeComments[0].id);
    } else {
      toggleView("comments");
    }
  };

  return (
    <div className="flex items-center gap-1 px-2 pt-1.5 pb-1 sm:px-3">
      <button
        type="button"
        aria-label="Open document tabs"
        onClick={() => setNavOpen(true)}
        className="mr-0.5 grid size-10 place-items-center rounded-full text-ink-sub transition-transform active:scale-95 hover:bg-hover md:hidden"
      >
        <Icon name="menu" size={22} />
      </button>
      <Tooltip label="Home">
        <Link
          href="/"
          aria-label="Home"
          className="mr-1 hidden size-10 shrink-0 place-items-center rounded-full transition-transform active:scale-95 hover:bg-hover md:grid"
        >
          <DocMark size={36} />
        </Link>
      </Tooltip>

      <div className="flex min-w-0 flex-col justify-center">
        <div className="flex items-center gap-1">
          <h1 className="truncate text-[18px] leading-tight font-normal text-ink" title={DOC_TITLE}>
            {DOC_TITLE}
          </h1>
          <Tooltip label={starred ? "Remove from Starred" : "Add to Starred"}>
            <button
              type="button"
              aria-pressed={starred}
              aria-label={starred ? "Remove from Starred" : "Add to Starred"}
              onClick={toggleStar}
              className="grid size-7 shrink-0 place-items-center rounded-full text-ink-mute transition-transform active:scale-90 hover:bg-hover"
            >
              <Icon name={starred ? "star_fill" : "star"} size={17} className={starred ? "text-[#f9ab00]" : ""} />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
        <IconButton
          icon="history"
          label="See version history"
          tip="See version history"
          onClick={openVersionHistory}
        />
        <IconButton
          icon="add_comment"
          label="Show all comments"
          tip={`Show all comments (${commentCount})`}
          active={view.comments}
          onClick={onCommentClick}
        />

        <button
          type="button"
          onClick={() => openDialog("share")}
          className="ml-1 flex h-9 items-center gap-2 rounded-full bg-share pl-3 pr-4 text-[14px] font-medium text-share-ink transition-[background,transform] duration-100 active:scale-[0.98] hover:bg-share-hover"
        >
          <Icon name="lock" size={18} />
          <span>Share</span>
        </button>

        <div className="hidden pl-1 sm:block">
          <Presence />
        </div>
      </div>
    </div>
  );
}
