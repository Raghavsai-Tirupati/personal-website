"use client";

import { useState } from "react";
import { Modal } from "@/components/common/dialog";
import { Icon, type IconName } from "@/components/icon";
import { useApp } from "@/components/state/app-state";
import { OWNER, DOC_TITLE, RESUME_PDF_READY, RESUME_PDF_PATH } from "@/lib/config";

function ActionButton({
  icon,
  label,
  onClick,
  href,
}: {
  icon: IconName;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "flex flex-col items-center gap-2 rounded-[10px] px-3 py-3 text-[12px] text-ink-sub transition-colors hover:bg-hover focus-visible:bg-hover";
  const inner = (
    <>
      <span className="grid size-11 place-items-center rounded-full bg-pill text-blue">
        <Icon name={icon} size={22} />
      </span>
      <span>{label}</span>
    </>
  );
  return href ? (
    <a className={cls} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}

export function ShareDialog() {
  const { dialog, closeDialog, pushToast } = useApp();
  const [copied, setCopied] = useState(false);
  const open = dialog === "share";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      pushToast("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      pushToast("Copy failed");
    }
  };

  const downloadPdf = () => {
    if (!RESUME_PDF_READY) {
      pushToast("Résumé PDF not added yet");
      return;
    }
    const a = document.createElement("a");
    a.href = RESUME_PDF_PATH;
    a.download = "Raghavsai-Tirupati-Resume.pdf";
    a.click();
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && closeDialog()}
      title={`Share "${DOC_TITLE}"`}
      titleSlot={
        <span className="text-[20px]">
          Share <span className="text-ink-mute">&ldquo;{DOC_TITLE}&rdquo;</span>
        </span>
      }
      describedBy="share-desc"
    >
      <div className="px-6 pb-6">
        <p id="share-desc" className="sr-only">
          Copy a link to this résumé or reach Raghavsai by email, LinkedIn, or GitHub.
        </p>

        {/* People with access */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="grid size-9 place-items-center rounded-full text-[13px] font-semibold text-white"
            style={{ background: OWNER.color }}
          >
            {OWNER.initials}
          </span>
          <div className="flex-1">
            <div className="text-[14px] font-medium text-ink">{OWNER.name} (you)</div>
            <div className="text-[12px] text-ink-mute">{OWNER.email}</div>
          </div>
          <span className="text-[13px] text-ink-mute">Owner</span>
        </div>

        {/* General access */}
        <div className="mb-5 flex items-center gap-3 rounded-[8px]">
          <span className="grid size-9 place-items-center rounded-full bg-[#e6f4ea] text-[#188038]">
            <Icon name="visibility" size={20} />
          </span>
          <div className="flex-1">
            <div className="text-[14px] font-medium text-ink">Anyone with the link</div>
            <div className="text-[12px] text-ink-mute">Anyone on the internet with the link can view</div>
          </div>
          <span className="text-[13px] text-ink-mute">Viewer</span>
        </div>

        {/* Reach me */}
        <div className="mb-5 grid grid-cols-4 gap-1">
          <ActionButton icon="mail" label="Email" href={`mailto:${OWNER.email}`} />
          <ActionButton icon="person" label="LinkedIn" href={OWNER.linkedin} />
          <ActionButton icon="description" label="GitHub" href={OWNER.github} />
          <ActionButton icon="download" label="Résumé PDF" onClick={downloadPdf} />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={copyLink}
            className="flex items-center gap-2 rounded-full border border-[#747775] px-4 py-2 text-[14px] font-medium text-blue transition-colors hover:bg-[#0b57d014]"
          >
            <Icon name={copied ? "check" : "link"} size={18} />
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-full bg-blue px-6 py-2 text-[14px] font-medium text-white transition-colors hover:bg-blue-hover"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
