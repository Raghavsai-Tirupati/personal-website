"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Icon } from "@/components/icon";
import { IconButton, Tooltip } from "@/components/common/ui";
import { useApp } from "@/components/state/app-state";
import { cn } from "@/lib/utils";

const Divider = () => <span className="mx-1 h-5 w-px bg-[#c7d0da]" />;

const menuCls =
  "z-[70] min-w-[120px] rounded-[8px] border border-black/5 bg-white py-1.5 shadow-[var(--shadow-menu)] origin-[var(--radix-dropdown-menu-content-transform-origin)] data-[state=open]:animate-[popIn_120ms_ease-out]";
const menuItemCls =
  "flex h-8 cursor-default select-none items-center gap-3 px-3 text-[14px] text-ink outline-none data-[highlighted]:bg-hover data-[disabled]:pointer-events-none data-[disabled]:text-[#bdc1c6]";

// A disabled editing control (view-only mode), shown greyed but present.
function DisabledControl({
  icon,
  label,
  text,
  caret,
  width,
}: {
  icon?: React.ComponentProps<typeof Icon>["name"];
  label: string;
  text?: string;
  caret?: boolean;
  width?: number;
}) {
  // A genuinely disabled control (view-only mode). Rendered as a real disabled
  // button so it reads honestly to assistive tech and keeps the light Docs look.
  return (
    <button
      type="button"
      disabled
      aria-label={`${label} (disabled in Viewing mode)`}
      title={`${label} (disabled in Viewing mode)`}
      className="flex h-8 cursor-default items-center gap-1 rounded-[4px] px-1.5 text-[#9aa0a6]"
      style={{ minWidth: width }}
    >
      {icon && <Icon name={icon} size={20} />}
      {text && <span className="text-[14px]">{text}</span>}
      {caret && <Icon name="keyboard_arrow_down" size={18} />}
    </button>
  );
}

export function Toolbar() {
  const { view, setView, pushToast } = useApp();
  const zoomLevels = [50, 75, 90, 100, 125, 150, 200];

  return (
    <div className="flex w-full justify-center px-2 pb-1.5 sm:px-3">
      <div className="flex h-10 w-full max-w-[var(--page-w)] items-center gap-0.5 overflow-x-auto rounded-full bg-pill px-2 docs-scroll">
        <IconButton icon="undo" label="Undo" tip="Undo" size={32} iconSize={19} disabled />
        <IconButton icon="redo" label="Redo" tip="Redo" size={32} iconSize={19} disabled />
        <IconButton
          icon="print"
          label="Print"
          tip="Print"
          kbd="⌘P"
          size={32}
          iconSize={19}
          onClick={() => window.print()}
        />
        <IconButton icon="spellcheck" label="Spelling and grammar check" tip="Spelling and grammar check" size={32} iconSize={19} disabled />

        <Divider />

        {/* Zoom (functional) */}
        <Dropdown.Root>
          <Tooltip label="Zoom">
            <Dropdown.Trigger asChild>
              <button
                type="button"
                className="flex h-8 items-center gap-1 rounded-[4px] px-2 text-[14px] text-ink-sub transition-colors hover:bg-hover data-[state=open]:bg-hover"
              >
                {view.zoom}%
                <Icon name="keyboard_arrow_down" size={18} />
              </button>
            </Dropdown.Trigger>
          </Tooltip>
          <Dropdown.Portal>
            <Dropdown.Content className={menuCls} sideOffset={6} align="start">
              {zoomLevels.map((z) => (
                <Dropdown.Item key={z} className={menuItemCls} onSelect={() => setView({ zoom: z })}>
                  <span className="grid w-5 place-items-center text-blue">
                    {view.zoom === z && <Icon name="check" size={16} />}
                  </span>
                  {z}%
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>

        <Divider />

        <DisabledControl label="Styles" text="Normal text" caret width={104} />
        <Divider />
        <DisabledControl label="Font" text="Lato" caret width={72} />
        <Divider />
        <DisabledControl icon="remove" label="Decrease font size" />
        <button type="button" disabled aria-label="Font size 11 (disabled in Viewing mode)" className="grid h-7 w-8 place-items-center rounded-[4px] border border-[#c7d0da] text-[13px] text-[#9aa0a6]">11</button>
        <DisabledControl icon="add" label="Increase font size" />
        <Divider />
        <DisabledControl icon="format_bold" label="Bold" />
        <DisabledControl icon="format_italic" label="Italic" />
        <DisabledControl icon="format_color_text" label="Text color" />

        <div className="ml-auto flex items-center gap-1 pl-2">
          {/* Mode selector (functional; Viewing is the honest state) */}
          <Dropdown.Root>
            <Tooltip label="Mode">
              <Dropdown.Trigger asChild>
                <button
                  type="button"
                  className="flex h-8 items-center gap-1.5 rounded-[4px] px-2 text-[13px] font-medium text-ink-sub transition-colors hover:bg-hover data-[state=open]:bg-hover"
                >
                  <Icon name="visibility" size={19} />
                  <span className="hidden sm:inline">Viewing</span>
                  <Icon name="keyboard_arrow_down" size={18} />
                </button>
              </Dropdown.Trigger>
            </Tooltip>
            <Dropdown.Portal>
              <Dropdown.Content className={cn(menuCls, "min-w-[280px]")} sideOffset={6} align="end">
                <div className="px-3 pb-1 pt-0.5 text-[12px] font-medium text-ink-mute">Mode</div>
                <Dropdown.Item className={menuItemCls} disabled>
                  <Icon name="format_bold" size={18} className="text-ink-mute" />
                  <span className="flex-1">
                    Editing
                    <span className="block text-[12px] text-ink-faint">Edit document directly</span>
                  </span>
                </Dropdown.Item>
                <Dropdown.Item className={menuItemCls} disabled>
                  <Icon name="format_italic" size={18} className="text-ink-mute" />
                  <span className="flex-1">
                    Suggesting
                    <span className="block text-[12px] text-ink-faint">Edits become suggestions</span>
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  className={cn(menuItemCls, "h-auto py-1.5")}
                  onSelect={() => pushToast("This document is view-only")}
                >
                  <Icon name="check" size={18} className="text-blue" />
                  <span className="flex-1">
                    Viewing
                    <span className="block text-[12px] text-ink-faint">Read or print final document</span>
                  </span>
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        </div>
      </div>
    </div>
  );
}
