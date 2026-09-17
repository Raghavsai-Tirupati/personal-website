"use client";

import * as RDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

// Docs-style modal shell: dimmed overlay, centered card, close affordance.
export function Modal({
  open,
  onOpenChange,
  title,
  titleSlot,
  children,
  className,
  describedBy,
  hideClose,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleSlot?: ReactNode;
  children: ReactNode;
  className?: string;
  describedBy?: string;
  hideClose?: boolean;
}) {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay className="no-print fixed inset-0 z-[100] bg-black/40 data-[state=open]:animate-[overlayIn_120ms_ease-out]" />
        <RDialog.Content
          aria-describedby={describedBy}
          className={cn(
            "no-print fixed left-1/2 top-1/2 z-[101] w-[min(92vw,512px)] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white shadow-[var(--shadow-dialog)] focus:outline-none data-[state=open]:animate-[popIn_140ms_ease-out]",
            className,
          )}
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-2">
            <RDialog.Title className="text-[22px] font-normal text-ink">
              {titleSlot ?? title}
            </RDialog.Title>
            {!hideClose && (
              <RDialog.Close
                className="-mr-2 grid size-9 place-items-center rounded-full text-ink-mute transition-colors hover:bg-hover"
                aria-label="Close"
              >
                <Icon name="close" size={22} />
              </RDialog.Close>
            )}
          </div>
          {children}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
