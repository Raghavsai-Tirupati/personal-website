"use client";

import { Modal } from "@/components/common/dialog";
import { useApp } from "@/components/state/app-state";

function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((k, i) => (
        <kbd
          key={i}
          className="inline-grid min-w-6 place-items-center rounded-[4px] border border-line bg-[#f8f9fa] px-1.5 py-0.5 text-[12px] font-medium text-ink-sub shadow-[0_1px_0_rgba(0,0,0,0.06)]"
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}

const GROUPS: { title: string; items: { label: string; keys: string[] }[] }[] = [
  {
    title: "Common actions",
    items: [
      { label: "Search the menus", keys: ["⌘", "K"] },
      { label: "Show keyboard shortcuts", keys: ["⌘", "/"] },
      { label: "Print", keys: ["⌘", "P"] },
    ],
  },
  {
    title: "Navigation",
    items: [
      { label: "Previous / next version (in version history)", keys: ["←", "→"] },
      { label: "Close a dialog, comment, or bar", keys: ["Esc"] },
    ],
  },
];

export function ShortcutsDialog() {
  const { dialog, closeDialog } = useApp();
  const open = dialog === "shortcuts";

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && closeDialog()}
      title="Keyboard shortcuts"
      className="w-[min(92vw,540px)]"
    >
      <div className="max-h-[70vh] overflow-y-auto px-6 pb-6 docs-scroll">
        {GROUPS.map((g) => (
          <section key={g.title} className="mb-5 last:mb-0">
            <h3 className="mb-1 text-[13px] font-semibold text-ink">{g.title}</h3>
            <ul>
              {g.items.map((it) => (
                <li key={it.label} className="flex items-center justify-between gap-4 border-b border-line-soft py-2.5 text-[14px] last:border-0">
                  <span className="text-ink-sub">{it.label}</span>
                  <Keys keys={it.keys} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-1 text-[12px] text-ink-faint">
          The browser&rsquo;s own Find (⌘F) is left untouched. Use Edit → Find in document for the
          in-document highlighter.
        </p>
      </div>
    </Modal>
  );
}
