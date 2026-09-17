"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import { getLink } from "@/lib/content";
import type { LinkId } from "@/lib/content";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const chipBase =
  "inline-flex max-w-full items-center gap-1 rounded-full border border-[#e0e3e7] bg-[#f8f9fa] px-1.5 py-[1px] align-baseline text-[0.94em] leading-[1.4] text-ink transition-colors hover:bg-[#eef0f2] focus-visible:bg-[#eef0f2]";

export function Chip({ id, className }: { id: LinkId; className?: string }) {
  const link = getLink(id);
  const isTodo = !!link.todo;

  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={link.favicon} alt="" width={14} height={14} className="size-[14px] shrink-0 rounded-[3px]" aria-hidden />
      <span className="truncate">{link.label}</span>
    </>
  );

  const trigger = isTodo ? (
    <span
      role="link"
      aria-disabled="true"
      tabIndex={0}
      className={cn(chipBase, "cursor-default text-ink-mute", className)}
    >
      {inner}
    </span>
  ) : (
    <a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={cn(chipBase, className)}
    >
      {inner}
    </a>
  );

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="top"
          align="start"
          sideOffset={8}
          className="no-print z-[75] w-[320px] overflow-hidden rounded-[8px] border border-black/5 bg-white shadow-[var(--shadow-menu)] origin-[var(--radix-hover-card-content-transform-origin)] data-[state=open]:animate-[popIn_120ms_ease-out]"
        >
          {link.thumbnail && (
            <div className="aspect-[16/9] w-full bg-[#f1f3f4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={link.thumbnail} alt="" className="size-full object-cover" />
            </div>
          )}
          <div className="flex items-start gap-2.5 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={link.favicon} alt="" width={20} height={20} className="mt-0.5 size-5 shrink-0 rounded" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-ink">{link.title}</div>
              <div className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-mute">
                <span className="truncate">{link.domain}</span>
              </div>
              {isTodo ? (
                <div className="mt-1.5 text-[12px] text-[#b06000]">Link not added yet</div>
              ) : (
                <div className="mt-1.5 flex items-center gap-1 text-[12px] text-blue">
                  <Icon name="open_in_new" size={13} />
                  Open link
                </div>
              )}
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
