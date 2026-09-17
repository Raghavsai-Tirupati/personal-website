"use client";

import * as Menubar from "@radix-ui/react-menubar";
import { Icon, type IconName } from "@/components/icon";
import { useApp } from "@/components/state/app-state";
import { OWNER, DOC_TITLE, RESUME_PDF_READY, RESUME_PDF_PATH } from "@/lib/config";
import { relativeEdit } from "@/lib/utils";
import { cn } from "@/lib/utils";

const triggerCls =
  "rounded-[4px] px-2 py-[3px] text-[14px] leading-5 text-ink-sub outline-none transition-colors data-[state=open]:bg-hover data-[highlighted]:bg-hover hover:bg-hover focus-visible:bg-hover cursor-default select-none";

const contentCls =
  "z-[70] min-w-[240px] rounded-[8px] border border-black/5 bg-white py-1.5 shadow-[var(--shadow-menu)] origin-[var(--radix-menubar-content-transform-origin)] data-[state=open]:animate-[popIn_120ms_ease-out]";

const itemCls =
  "group flex h-9 cursor-default select-none items-center gap-3 px-3 text-[14px] text-ink outline-none data-[highlighted]:bg-hover data-[disabled]:pointer-events-none data-[disabled]:text-[#bdc1c6]";

function MItem({
  children,
  onSelect,
  icon,
  shortcut,
  disabled,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  icon?: IconName;
  shortcut?: string;
  disabled?: boolean;
}) {
  return (
    <Menubar.Item className={itemCls} onSelect={onSelect} disabled={disabled}>
      <span className="grid w-5 place-items-center text-ink-mute">
        {icon && <Icon name={icon} size={18} />}
      </span>
      <span className="flex-1">{children}</span>
      {shortcut && <span className="pl-6 text-[13px] text-ink-faint">{shortcut}</span>}
    </Menubar.Item>
  );
}

function MCheck({
  children,
  checked,
  onSelect,
  shortcut,
}: {
  children: React.ReactNode;
  checked: boolean;
  onSelect: () => void;
  shortcut?: string;
}) {
  return (
    <Menubar.CheckboxItem
      className={itemCls}
      checked={checked}
      onSelect={(e) => {
        e.preventDefault();
        onSelect();
      }}
    >
      <span className="grid w-5 place-items-center text-blue">
        <Menubar.ItemIndicator>
          <Icon name="check" size={18} />
        </Menubar.ItemIndicator>
      </span>
      <span className="flex-1">{children}</span>
      {shortcut && <span className="pl-6 text-[13px] text-ink-faint">{shortcut}</span>}
    </Menubar.CheckboxItem>
  );
}

function MSep() {
  return <Menubar.Separator className="my-1.5 h-px bg-line-soft" />;
}

export function MenuBar({ lastEditISO }: { lastEditISO: string }) {
  const {
    openDialog,
    openVersionHistory,
    setFindOpen,
    view,
    toggleView,
    setView,
    pushToast,
  } = useApp();

  const copy = async (text: string, toast: string) => {
    try {
      await navigator.clipboard.writeText(text);
      pushToast(toast);
    } catch {
      pushToast("Copy failed");
    }
  };

  const currentUrl = () => (typeof window !== "undefined" ? window.location.href : "");
  const mailtoFile = `mailto:?subject=${encodeURIComponent(DOC_TITLE)}&body=${encodeURIComponent(
    `Raghavsai Tirupati — résumé: ${currentUrl()}`,
  )}`;

  const zoomLevels = [50, 75, 90, 100, 125, 150, 200];

  return (
    <>
    <Menubar.Root className="flex items-center gap-0.5">
      {/* File */}
      <Menubar.Menu>
        <Menubar.Trigger className={triggerCls}>File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className={contentCls} align="start" sideOffset={4}>
            <MItem icon="person" onSelect={() => openDialog("share")}>
              Share
            </MItem>
            <Menubar.Sub>
              <Menubar.SubTrigger className={itemCls}>
                <span className="grid w-5 place-items-center text-ink-mute">
                  <Icon name="download" size={18} />
                </span>
                <span className="flex-1">Download</span>
                <Icon name="chevron_right" size={18} className="text-ink-mute" />
              </Menubar.SubTrigger>
              <Menubar.Portal>
                <Menubar.SubContent className={contentCls} sideOffset={2} alignOffset={-6}>
                  {RESUME_PDF_READY ? (
                    <MItem
                      icon="description"
                      onSelect={() => {
                        const a = document.createElement("a");
                        a.href = RESUME_PDF_PATH;
                        a.download = "Raghavsai-Tirupati-Resume.pdf";
                        a.click();
                      }}
                    >
                      PDF document (.pdf)
                    </MItem>
                  ) : (
                    <MItem icon="description" disabled>
                      Résumé PDF not added yet
                    </MItem>
                  )}
                </Menubar.SubContent>
              </Menubar.Portal>
            </Menubar.Sub>
            <MItem icon="mail" onSelect={() => (window.location.href = mailtoFile)}>
              Email this file
            </MItem>
            <MSep />
            <MItem icon="history" onSelect={openVersionHistory}>
              See version history
            </MItem>
            <MSep />
            <MItem icon="print" shortcut="⌘P" onSelect={() => window.print()}>
              Print
            </MItem>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* Edit */}
      <Menubar.Menu>
        <Menubar.Trigger className={triggerCls}>Edit</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className={contentCls} align="start" sideOffset={4}>
            <MItem icon="mail" onSelect={() => copy(OWNER.email, "Email address copied")}>
              Copy email address
            </MItem>
            <MItem icon="link" onSelect={() => copy(currentUrl(), "Link copied")}>
              Copy link to current tab
            </MItem>
            <MSep />
            <MItem icon="search" onSelect={() => setFindOpen(true)}>
              Find in document
            </MItem>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* View */}
      <Menubar.Menu>
        <Menubar.Trigger className={triggerCls}>View</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className={contentCls} align="start" sideOffset={4}>
            <Menubar.Sub>
              <Menubar.SubTrigger className={itemCls}>
                <span className="grid w-5 place-items-center text-ink-mute">
                  <Icon name="visibility" size={18} />
                </span>
                <span className="flex-1">Mode</span>
                <Icon name="chevron_right" size={18} className="text-ink-mute" />
              </Menubar.SubTrigger>
              <Menubar.Portal>
                <Menubar.SubContent className={contentCls} sideOffset={2} alignOffset={-6}>
                  <MItem disabled>Editing</MItem>
                  <MItem disabled>Suggesting</MItem>
                  <MCheck checked onSelect={() => {}}>
                    Viewing
                  </MCheck>
                </Menubar.SubContent>
              </Menubar.Portal>
            </Menubar.Sub>
            <MSep />
            <MCheck checked={view.comments} onSelect={() => toggleView("comments")}>
              Show comments
            </MCheck>
            <MCheck checked={view.ruler} onSelect={() => toggleView("ruler")}>
              Show ruler
            </MCheck>
            <MCheck checked={view.tabs} onSelect={() => toggleView("tabs")}>
              Show tabs &amp; outline
            </MCheck>
            <MSep />
            <MCheck checked={view.pageless} onSelect={() => toggleView("pageless")}>
              Pageless
            </MCheck>
            <MSep />
            <Menubar.Sub>
              <Menubar.SubTrigger className={itemCls}>
                <span className="grid w-5 place-items-center text-ink-mute">
                  <Icon name="zoom_in" size={18} />
                </span>
                <span className="flex-1">Zoom</span>
                <span className="pr-2 text-[13px] text-ink-faint">{view.zoom}%</span>
                <Icon name="chevron_right" size={18} className="text-ink-mute" />
              </Menubar.SubTrigger>
              <Menubar.Portal>
                <Menubar.SubContent className={contentCls} sideOffset={2} alignOffset={-6}>
                  {zoomLevels.map((z) => (
                    <Menubar.Item
                      key={z}
                      className={itemCls}
                      onSelect={() => setView({ zoom: z })}
                    >
                      <span className="grid w-5 place-items-center text-blue">
                        {view.zoom === z && <Icon name="check" size={18} />}
                      </span>
                      <span className="flex-1">{z}%</span>
                    </Menubar.Item>
                  ))}
                </Menubar.SubContent>
              </Menubar.Portal>
            </Menubar.Sub>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* Tools */}
      <Menubar.Menu>
        <Menubar.Trigger className={triggerCls}>Tools</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className={contentCls} align="start" sideOffset={4}>
            <MItem icon="format_list_bulleted" onSelect={() => openDialog("wordcount")}>
              Word count
            </MItem>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* Help */}
      <Menubar.Menu>
        <Menubar.Trigger className={triggerCls}>Help</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className={contentCls} align="start" sideOffset={4}>
            <MItem icon="search" shortcut="⌘K" onSelect={() => openDialog("menusearch")}>
              Search the menus
            </MItem>
            <MItem icon="grid_view" shortcut="⌘/" onSelect={() => openDialog("shortcuts")}>
              Keyboard shortcuts
            </MItem>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>

      {/* Last edit -> version history (outside the menubar role) */}
      <button
        type="button"
        onClick={openVersionHistory}
        aria-label="See version history"
        className={cn(
          "ml-auto hidden rounded-[4px] px-2 py-[3px] text-[13px] text-ink-mute transition-colors hover:bg-hover md:block",
        )}
      >
        {relativeEdit(lastEditISO)}
      </button>
    </>
  );
}
