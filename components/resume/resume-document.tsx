"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { RESUME, visibleAt, addedIn, TABS_BY_ID, type Anchor, type Bullet, type TabId } from "@/lib/content";
import { useApp } from "@/components/state/app-state";
import { Icon } from "@/components/icon";
import { CommentAnchor } from "./comment-anchor";
import { Chip } from "./chip";

// Wraps an entry title in a link to its deep-dive tab, with a clear affordance
// (persistent ↗ icon, hover underline + blue). Plain text if there's no tab.
function EntryLink({ tab, children }: { tab?: TabId; children: ReactNode }) {
  if (!tab) return <>{children}</>;
  const route = TABS_BY_ID[tab]?.route ?? "/";
  return (
    <Link
      href={route}
      className="group text-ink underline-offset-[3px] decoration-[#0b57d0]/50 transition-colors hover:text-blue hover:underline focus-visible:text-blue focus-visible:underline"
    >
      {children}
      <Icon
        name="open_in_new"
        size={12}
        aria-hidden
        className="ml-[3px] inline-block translate-y-[1px] text-[#9aa0a6] transition-colors group-hover:text-blue print:hidden"
      />
    </Link>
  );
}

// Wrap each bold phrase in <strong>, matching the LaTeX \textbf{...}.
function boldify(text: string, bold: string[] = []): ReactNode {
  if (!bold.length) return text;
  let nodes: ReactNode[] = [text];
  for (const phrase of bold) {
    const out: ReactNode[] = [];
    for (const n of nodes) {
      if (typeof n !== "string") {
        out.push(n);
        continue;
      }
      const i = n.indexOf(phrase);
      if (i < 0) {
        out.push(n);
        continue;
      }
      if (i > 0) out.push(n.slice(0, i));
      out.push(<strong className="font-bold">{phrase}</strong>);
      const rest = n.slice(i + phrase.length);
      if (rest) out.push(rest);
    }
    nodes = out;
  }
  return nodes.map((n, i) => <Fragment key={i}>{n}</Fragment>);
}

// Split a bullet on its anchor phrases (wrapping each in a CommentAnchor), then
// apply bold within every piece so bolds nested inside an anchor still render.
function renderInline(text: string, anchors: Anchor[] = [], bold: string[] = []): ReactNode {
  type Piece = { type: "text" | "anchor"; text: string; commentId?: string };
  let pieces: Piece[] = [{ type: "text", text }];
  for (const a of anchors) {
    const out: Piece[] = [];
    for (const pc of pieces) {
      if (pc.type !== "text") {
        out.push(pc);
        continue;
      }
      const i = pc.text.indexOf(a.phrase);
      if (i < 0) {
        out.push(pc);
        continue;
      }
      if (i > 0) out.push({ type: "text", text: pc.text.slice(0, i) });
      out.push({ type: "anchor", text: a.phrase, commentId: a.commentId });
      const rest = pc.text.slice(i + a.phrase.length);
      if (rest) out.push({ type: "text", text: rest });
    }
    pieces = out;
  }
  return pieces.map((pc, idx) => {
    const inner = boldify(pc.text, bold);
    return pc.type === "anchor" ? (
      <CommentAnchor key={idx} commentId={pc.commentId!}>
        {inner}
      </CommentAnchor>
    ) : (
      <Fragment key={idx}>{inner}</Fragment>
    );
  });
}

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-[17px] mb-[6px] border-b border-[#4a4a4a] pb-[2px] text-[14px] font-bold tracking-[0.02em] text-ink [font-variant:small-caps]"
    >
      {children}
    </h2>
  );
}

function Bullets({ bullets, version, blockAdded }: { bullets: Bullet[]; version: string | null; blockAdded: boolean }) {
  const visible = bullets.filter((b) => visibleAt(b.addedOn, version));
  if (!visible.length) return null;
  return (
    <ul className="mt-[3px] list-disc space-y-[2.5px] pl-[17px] marker:text-ink">
      {visible.map((b) => {
        const added = !blockAdded && addedIn(b.addedOn, version);
        return (
          <li key={b.id} data-added={added ? "true" : undefined} className="pl-[2px]">
            <span className="resume-bullet-text">{renderInline(b.text, b.anchors, b.bold)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function ResumeDocument() {
  const { version } = useApp();
  const r = RESUME;

  const education = r.education.filter((e) => visibleAt(e.addedOn, version));
  const honors = r.honors.filter((h) => visibleAt(h.addedOn, version));
  const experience = r.experience.filter((e) => visibleAt(e.addedOn, version));
  const projects = r.projects.filter((p) => visibleAt(p.addedOn, version));

  return (
    <div className="font-body text-[12.5px] leading-[1.34] text-ink">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-[28px] font-medium tracking-[0.04em] text-ink [font-variant:small-caps]">
          {r.header.name}
        </h1>
        <p className="mt-[6px] flex flex-wrap items-center justify-center gap-x-[8px] gap-y-1 text-[12px] text-ink-sub">
          <span>{r.header.location}</span>
          {r.header.contactChips.map((id) => (
            <Fragment key={id}>
              <span aria-hidden className="text-ink-faint">
                |
              </span>
              <Chip id={id} />
            </Fragment>
          ))}
        </p>
      </header>

      {/* Education */}
      {education.length > 0 && (
        <section>
          <SectionHeading id="section-education">{r.educationHeading}</SectionHeading>
          {education.map((e) => (
            <div key={e.id} data-added={addedIn(e.addedOn, version) ? "true" : undefined}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-bold">{e.school}</span>
                <span className="shrink-0 text-[12px] font-bold text-ink">{e.dates}</span>
              </div>
              <div className="text-[12.5px] italic">{e.degree}</div>
            </div>
          ))}
          {honors.length > 0 && (
            <p className="mt-[3px] text-[12.5px]">
              <span className="font-bold">Honors: </span>
              {honors.map((h, i) => (
                <Fragment key={h.id}>
                  <span data-added={addedIn(h.addedOn, version) ? "true" : undefined}>
                    {renderInline(h.text, h.anchors)}
                  </span>
                  {i < honors.length - 1 && <span>, </span>}
                </Fragment>
              ))}
            </p>
          )}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <SectionHeading id="section-experience">{r.experienceHeading}</SectionHeading>
          {experience.map((e) => {
            const blockAdded = addedIn(e.addedOn, version);
            return (
              <div key={e.id} className="mt-[9px] first:mt-[2px]">
                <div data-added={blockAdded ? "true" : undefined}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 id={`entry-${e.id}`} className="text-[13px] font-bold">
                      <EntryLink tab={e.tab}>{e.org}</EntryLink>
                    </h3>
                    <span className="shrink-0 text-[12px] font-bold text-ink">{e.dates}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12.5px] italic">{e.role}</span>
                    <span className="shrink-0 text-[12px] text-ink-sub">{e.location}</span>
                  </div>
                </div>
                <Bullets bullets={e.bullets} version={version} blockAdded={blockAdded} />
              </div>
            );
          })}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <SectionHeading id="section-projects">{r.projectsHeading}</SectionHeading>
          {projects.map((p) => {
            const blockAdded = addedIn(p.addedOn, version);
            return (
              <div key={p.id} className="mt-[9px] first:mt-[2px]">
                <div data-added={blockAdded ? "true" : undefined} className="flex items-baseline justify-between gap-3">
                  <h3 id={`entry-${p.id}`} className="min-w-0 text-[13px] leading-snug">
                    <EntryLink tab={p.tab}>
                      <span className="font-bold">{p.name}</span>
                    </EntryLink>
                    <span className="font-normal text-ink-sub italic"> | {p.meta}</span>
                  </h3>
                  {p.titleChips && p.titleChips.length > 0 && (
                    <div className="flex shrink-0 items-center gap-2">
                      {p.titleChips.map((id) => <Chip key={id} id={id} className="font-normal" />)}
                    </div>
                  )}
                </div>
                <Bullets bullets={p.bullets} version={version} blockAdded={blockAdded} />
              </div>
            );
          })}
        </section>
      )}

      {/* Technical skills */}
      <section>
        <SectionHeading id="section-skills">{r.skillsHeading}</SectionHeading>
        <div className="space-y-[3px]">
          {r.skills.map((g) => (
            <p key={g.label} className="text-[12.5px]">
              <span className="font-bold">{g.label}: </span>
              {g.items.join(", ")}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
