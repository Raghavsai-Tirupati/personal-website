# Raghavsai Tirupati — Résumé site

A personal software-engineering site that is a faithful, fully working recreation of the
Google Docs editor. The open document is my résumé; every entry expands into deeper
write-ups, links, and a career timeline using real Docs patterns: comments, smart chips,
document tabs, and version history.

Built with Next.js (App Router, static generation), TypeScript (strict), Tailwind CSS v4,
Radix UI primitives, and Motion only where CSS can't reach. It runs entirely on localhost
with no external runtime dependencies.

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
```

Production check (this is what the performance targets are measured against):

```bash
npm run build
npm run start          # serves the static production build on http://localhost:3000
```

To point Share → Copy link and all canonical/OG metadata at a real origin later, set one
value: `NEXT_PUBLIC_SITE_URL` (see `lib/config.ts`, default `http://localhost:3000`). No
other rewrites are needed to deploy — it is a clean static build.

## Where the content lives

All copy is typed data under `lib/content/` — edit these, not the components. The build
validates required fields and prints every `TODO` in the build output (`npm run build`).

| File | What it holds |
| --- | --- |
| `lib/content/resume.ts` | The résumé: header, education, experience, projects, skills. Each entry/bullet carries an `addedOn` ISO date that drives version history, and optional comment `anchors`. |
| `lib/content/comments.ts` | Comment threads (short deep dives), anchored to phrases in the résumé. |
| `lib/content/tabs.ts` | Document tabs + deep-dive write-ups (Overview / Demo / How it works / Results / Stack / Links) and the inline SVG diagrams. |
| `lib/content/versions.ts` | The career timeline shown as Docs "versions". `dateTodo: true` flags a placeholder date. |
| `lib/content/links.ts` | Smart-chip / link-preview registry (URL, label, domain, favicon, thumbnail). |
| `lib/content/videos.ts` | Demo video registry (self-hosted files under `public/videos`). |
| `lib/config.ts` | Name, contact, `SITE_URL`, and `RESUME_PDF_READY`. |

Adding a résumé PDF: drop a web version (no GPA, no phone, no research) at
`public/resume.pdf` and set `RESUME_PDF_READY = true` in `lib/config.ts`. Until then, the
Download item and Share dialog show a "Résumé PDF not added yet" state instead of a broken
link. Any other résumé file in the project is reference-only and is never served.

Adding a demo video: drop `public/videos/<id>.mp4` (optionally `<id>.webm`, a poster
`<id>.jpg`, and captions `<id>.vtt`), then set `src`/`poster`/`captions` on that entry in
`lib/content/videos.ts` and remove its `todo`. Until then the figure shows a poster with a
"Demo video not added yet" state — never a broken embed.

## What's real in the chrome

Every control does something honest — no dead buttons. Editing controls are shown disabled,
exactly as Docs renders a view-only document.

- **Title bar** — star (local favourite + toast), version-history clock, comment count, Share.
- **Share dialog** — Copy link (with toast), email (mailto), LinkedIn, GitHub, Résumé PDF.
- **Menus** — File (Share, Download, Email, Version history, Print ⌘P), Edit (copy email, copy
  link, Find in document via the CSS Custom Highlight API — the browser's ⌘F is left alone),
  View (Mode, Show comments/ruler/tabs, Pageless, Zoom), Tools (Word count), Help (Search the
  menus ⌘K, Keyboard shortcuts ⌘/).
- **Comments** — anchored yellow highlights, margin cards that stack and align to their line,
  active card elevates. Deep-links: `#comment-acsi-noise-floor`.
- **Smart chips** — inline links with hover/focus preview cards (local favicons + thumbnails).
- **Selection** — select résumé text to get "Copy link to highlight" (a `:~:text=` fragment).
- **Document tabs** — Résumé + ACSI, Iris, Matchbook, ClinicalHours, Brinks Home. Each is its
  own route with scroll-spy outline; deep-dive pages are pageless.
- **Version history** — the signature feature. The clock opens the Docs version panel grouped
  by month; selecting a milestone re-renders the résumé as of that date with the additions in
  suggestion-green. Arrow keys move between versions; the version is in the URL
  (`?version=2026-07-20`).

## Keyboard & a11y

Real HTML throughout (headings, lists, links), skip link, `aria-live` toasts, visible focus
rings, full menu keyboard support (Radix). Mobile: tabs/outline in a left drawer, comments as
a bottom sheet (drag handle, swipe/Escape to dismiss), collapsed top bar, no horizontal
scroll. axe (WCAG 2.1 A/AA) reports 0 non-minor violations on all routes.

## Scripts (dev tooling)

- `scripts/shoot.mjs` — Playwright screenshot helper.
- `scripts/axe.mjs` — axe-core accessibility scan across routes (needs `npm run start` on 3100).

## Deploy later (not done here — local only by design)

It is a standard static Next build. Set `NEXT_PUBLIC_SITE_URL`, deploy the output to any host,
done. No hosting config, remote repo, analytics, or runtime external calls were added.

See `TODO.md` for the outstanding content/asset checklist and `design/` for the plan and the
self-critique.
