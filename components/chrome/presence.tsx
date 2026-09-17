"use client";

import { OWNER } from "@/lib/config";
import { Tooltip } from "@/components/common/ui";

// Owner avatar: RT monogram with a colored presence ring.
function OwnerAvatar() {
  return (
    <Tooltip label={`${OWNER.name} (you)`}>
      <button
        type="button"
        aria-label={`${OWNER.name}, signed in`}
        className="relative z-10 -ml-2 grid size-8 place-items-center rounded-full text-[12px] font-semibold text-white ring-2 ring-offset-2 ring-offset-white transition-transform active:scale-95"
        style={{ background: OWNER.color, ["--tw-ring-color" as string]: OWNER.color }}
      >
        {OWNER.initials}
      </button>
    </Tooltip>
  );
}

// A single anonymous visitor, the way Docs labels signed-out viewers.
function AnonymousViewer() {
  return (
    <Tooltip label="Anonymous Narwhal">
      <button
        type="button"
        aria-label="Anonymous Narwhal is viewing"
        className="grid size-8 place-items-center rounded-full bg-[#e8710a] text-[13px] ring-2 ring-[#e8710a] ring-offset-2 ring-offset-white transition-transform active:scale-95"
      >
        <span aria-hidden>🐳</span>
      </button>
    </Tooltip>
  );
}

export function Presence() {
  return (
    <div className="flex items-center pl-1">
      <AnonymousViewer />
      <OwnerAvatar />
    </div>
  );
}
