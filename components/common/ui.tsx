"use client";

import * as RTooltip from "@radix-ui/react-tooltip";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icon";
import { useApp } from "@/components/state/app-state";

// One provider at the app root: first tooltip in a group waits, neighbours
// appear immediately (matches Docs).
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <RTooltip.Provider delayDuration={500} skipDelayDuration={300}>
      {children}
    </RTooltip.Provider>
  );
}

export function Tooltip({
  label,
  children,
  side = "bottom",
  kbd,
}: {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  kbd?: string;
}) {
  return (
    <RTooltip.Root>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          side={side}
          sideOffset={6}
          className="no-print z-[80] flex items-center gap-2 rounded-[4px] bg-[#3c4043] px-2 py-1 text-[11px] font-medium text-white shadow-md select-none data-[state=delayed-open]:animate-[fadeIn_120ms_ease-out]"
        >
          {label}
          {kbd && <span className="text-[#bdc1c6]">{kbd}</span>}
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
  tip?: string;
  kbd?: string;
  iconSize?: number;
  size?: number;
  active?: boolean;
  tipSide?: "top" | "bottom" | "left" | "right";
};

// Round hover-target icon button used across the chrome.
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, tip, kbd, iconSize = 20, size = 36, active, className, tipSide = "bottom", ...rest },
  ref,
) {
  const btn = (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        "grid place-items-center rounded-full text-ink-sub transition-[background,transform] duration-100 active:scale-[0.94] hover:bg-hover focus-visible:bg-hover disabled:pointer-events-none disabled:text-[#bdc1c6]",
        active && "bg-pill-active text-blue",
        className,
      )}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
  if (!tip) return btn;
  return (
    <Tooltip label={tip} kbd={kbd} side={tipSide}>
      {btn}
    </Tooltip>
  );
});

// Bottom-left aria-live toast stack, Docs "snackbar" styling.
export function ToastRegion() {
  const { toasts } = useApp();
  return (
    <div
      className="no-print pointer-events-none fixed bottom-5 left-5 z-[90] flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center rounded-[4px] bg-[#3c4043] px-4 py-3 text-[13px] text-white shadow-[var(--shadow-menu)] animate-[toastIn_160ms_ease-out]"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
