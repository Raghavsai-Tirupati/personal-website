"use client";

import * as RDialog from "@radix-ui/react-dialog";
import { useApp } from "@/components/state/app-state";
import { TabsPanel } from "./tabs-panel";
import { Icon } from "@/components/icon";

// Mobile left drawer holding the document tabs and outline.
export function NavDrawer() {
  const { navOpen, setNavOpen } = useApp();
  return (
    <RDialog.Root open={navOpen} onOpenChange={setNavOpen}>
      <RDialog.Portal>
        <RDialog.Overlay className="no-print fixed inset-0 z-[95] bg-black/40 data-[state=open]:animate-[overlayIn_150ms_ease-out] md:hidden" />
        <RDialog.Content
          className="no-print fixed left-0 top-0 z-[96] flex h-[100dvh] w-[86vw] max-w-[320px] flex-col bg-chrome shadow-[var(--shadow-dialog)] data-[state=open]:animate-[slideInLeft_220ms_cubic-bezier(0.32,0.72,0,1)] md:hidden"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <RDialog.Title className="text-[15px] font-medium text-ink">Document tabs</RDialog.Title>
            <RDialog.Close aria-label="Close" className="grid size-9 place-items-center rounded-full text-ink-mute hover:bg-hover">
              <Icon name="close" size={22} />
            </RDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto docs-scroll">
            <TabsPanel onNavigate={() => setNavOpen(false)} />
          </div>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
