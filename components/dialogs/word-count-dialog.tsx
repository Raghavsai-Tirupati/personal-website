"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/common/dialog";
import { useApp } from "@/components/state/app-state";

type Counts = { words: number; characters: number; noSpaces: number };

function countText(text: string): Counts {
  const trimmed = text.replace(/\s+/g, " ").trim();
  const words = trimmed ? trimmed.split(" ").length : 0;
  const characters = text.replace(/\n/g, "").length;
  const noSpaces = text.replace(/\s/g, "").length;
  return { words, characters, noSpaces };
}

export function WordCountDialog() {
  const { dialog, closeDialog } = useApp();
  const open = dialog === "wordcount";
  const [counts, setCounts] = useState<Counts>({ words: 0, characters: 0, noSpaces: 0 });

  useEffect(() => {
    if (!open) return;
    const el = document.querySelector<HTMLElement>("[data-page]");
    setCounts(countText(el?.innerText ?? ""));
  }, [open]);

  const rows: [string, number][] = [
    ["Pages", 1],
    ["Words", counts.words],
    ["Characters", counts.characters],
    ["Characters excluding spaces", counts.noSpaces],
  ];

  return (
    <Modal open={open} onOpenChange={(o) => !o && closeDialog()} title="Word count" className="w-[min(92vw,360px)]">
      <div className="px-6 pb-2">
        <dl className="divide-y divide-line-soft">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2.5 text-[14px]">
              <dt className="text-ink-sub">{label}</dt>
              <dd className="font-medium tabular-nums text-ink">{value.toLocaleString()}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex justify-end px-6 pb-5 pt-2">
        <button
          type="button"
          onClick={closeDialog}
          className="rounded-full bg-blue px-6 py-2 text-[14px] font-medium text-white transition-colors hover:bg-blue-hover"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}
