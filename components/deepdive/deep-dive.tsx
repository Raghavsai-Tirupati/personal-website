"use client";

import { TABS_BY_ID, type TabId, type DeepDiveSection } from "@/lib/content";
import { Chip } from "@/components/resume/chip";
import { VideoFigure } from "./video-figure";
import { formatLongDate } from "@/lib/utils";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Section({ s }: { s: DeepDiveSection }) {
  const id = `dd-${slug(s.heading)}`;
  return (
    <section className="mt-8 first:mt-0">
      <h2 id={id} className="mb-3 text-[16px] font-semibold tracking-[-0.01em] text-ink">
        {s.heading}
      </h2>

      {s.kind === "prose" &&
        s.paragraphs.map((p, i) => (
          <p key={i} className="mb-3 text-[15px] leading-[1.7] text-ink-sub last:mb-0">
            {p}
          </p>
        ))}

      {s.kind === "video" && <VideoFigure videoId={s.videoId} />}

      {s.kind === "diagram" && (
        <figure className="my-1">
          <div
            className="rounded-[10px] border border-line bg-white p-5"
            dangerouslySetInnerHTML={{ __html: s.diagram }}
          />
          {s.caption && <figcaption className="mt-3 text-[14px] leading-[1.6] text-ink-sub">{s.caption}</figcaption>}
        </figure>
      )}

      {s.kind === "results" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {s.items.map((it, i) => (
            <div key={i} className="rounded-[10px] border border-line bg-[#f8fafd] p-4">
              <div className="text-[24px] font-semibold tracking-[-0.02em] text-blue">{it.value}</div>
              <div className="mt-1 text-[13px] font-medium text-ink">{it.label}</div>
              {it.note && <div className="mt-0.5 text-[12px] leading-[1.45] text-ink-mute">{it.note}</div>}
            </div>
          ))}
        </div>
      )}

      {s.kind === "stack" && (
        <div className="space-y-3">
          {s.groups.map((g) => (
            <div key={g.label} className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-semibold text-ink-mute">{g.label}:</span>
              {g.items.map((it) => (
                <span key={it} className="rounded-full border border-line bg-[#f8f9fa] px-2.5 py-1 text-[13px] text-ink-sub">
                  {it}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {s.kind === "links" && (
        <div className="flex flex-wrap items-center gap-2.5 text-[15px]">
          {s.links.map((id) => (
            <Chip key={id} id={id} />
          ))}
        </div>
      )}
    </section>
  );
}

export function DeepDive({ tabId }: { tabId: TabId }) {
  const tab = TABS_BY_ID[tabId];
  if (!tab || !tab.sections) return null;

  return (
    <article className="font-body">
      <header className="mb-6 border-b border-line pb-5">
        <h1 className="text-[30px] font-bold tracking-[-0.02em] text-ink">{tab.label}</h1>
        {tab.subtitle && <p className="mt-1.5 text-[15px] text-ink-mute">{tab.subtitle}</p>}
        {tab.addedOn && (
          <p className="mt-2 text-[13px] text-ink-mute">
            Added to this résumé on {formatLongDate(tab.addedOn)}
          </p>
        )}
      </header>
      {tab.sections.map((s, i) => (
        <Section key={i} s={s} />
      ))}
    </article>
  );
}
