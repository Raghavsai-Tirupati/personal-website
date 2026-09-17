# Design plan

## Reference note (honest deviation)

The brief's Process step 1 asked for Playwright screenshots of a live public Google Doc. A
generic public doc does not expose comments, version history, or document tabs without a
specially prepared file, so instead I recreated the current Material 3 Docs web UI from the
documented token set below plus the known current UI, and verified fidelity against my own
rendered screenshots at 390 / 768 / 1440 / 2560 px (in `design/shots/`). If you want, I can
add a live side-by-side sampling pass against a doc you prepare.

## Verified tokens (in `app/globals.css` `@theme`)

| Token | Value | Use |
| --- | --- | --- |
| canvas | `#F9FBFD` | scroll background |
| chrome | `#FFFFFF` | top bars, panels |
| toolbar pill | `#EDF2FA` | toolbar background |
| pill active | `#D3E3FD` | active toolbar/tab state |
| primary blue | `#0B57D0` | brand, links, focus |
| share fill | `#C2E7FF` (ink `#062E6F`) | Share button |
| ink / sub / mute / faint | `#1F1F1F` / `#444746` / `#5F6368` / `#80868B` | text ramp |
| hairline / line / line-soft | `#C7C7C7` / `#E3E3E3` / `#EDEEF0` | rules, dividers |
| comment rest / anchor / active | `#FDECC0` / `#FDDB6B` / `#FBBC04` | comment highlight |
| suggestion green / bg | `#188038` / `#E6F4EA` | version-history additions |

Radii: pill 9999, button 4, card/menu/dialog 8. Shadows: menu / card / dialog / page (see
tokens). Type: **Google Sans Flex** (chrome, variable weight) and **Lato** (résumé body,
11pt-equivalent), both self-hosted via `next/font/local` and preloaded. Icons: Material
Symbols Rounded, inlined as tree-shaken SVG (no icon-font download).

Brand: no Google logos, Docs product icon, or the words "Google Docs". The Docs icon is
replaced by an "RT" monogram document mark (`components/brand.tsx`, `app/icon.svg`).

## Component inventory → Docs feature

- **Chrome**: `TitleBar` (title, star+toast, history, comments, Share, presence),
  `MenuBar` (Radix Menubar, File/Edit/View/Tools/Help), `Toolbar` (pill; editing controls
  disabled in Viewing mode), `Ruler`, `PageFrame` (letter sheet / pageless, zoom).
- **Panels**: `TabsPanel` (tabs + outline scroll-spy), `CommentsLayer` (aligned stacked
  cards), `VersionPanel` + `VersionHeader`, `NavDrawer` (mobile), `CommentSheet` (mobile).
- **Document**: `ResumeDocument` (version-aware, anchored), `CommentAnchor`, `Chip`
  (+ hover/focus preview), `DeepDive` + `VideoFigure`, `SelectionToolbar`.
- **Dialogs**: `ShareDialog`, `ShortcutsDialog`, `WordCountDialog`, `MenuSearch`, `FindBar`.
- **State**: one `AppStateProvider` (view options, version, active comment, dialogs, toasts,
  URL sync for version/comment/pageless/zoom).

## Wireframes

Desktop:
```
┌───────────────────────────────────────────────────────────────────────────┐
│ [RT] Raghavsai Tirupati – Résumé ☆            🕘  💬  [Share]  (🐳 RT)      │
│ File Edit View Tools Help                     Last edit was N days ago       │
│ ( ↶ ↷ 🖨 | 100%▾ | Normal text▾ | Lato▾ | 11 | B I A |          👁 Viewing▾)│
│ ─────────── ruler ───────────                                               │
├──────────┬───────────────────────────────────────────┬────────────────────┤
│ Tabs     │            ┌──────────────────┐            │  ┌──────────────┐  │
│ • Résumé │            │  RAGHAVSAI …      │            │  │ 💬 card       │  │
│   Educ.  │            │  Experience …     │  (page)    │  │ aligned to    │  │
│   Exp.   │            │  Projects …       │            │  │ its anchor    │  │
│ • ACSI … │            └──────────────────┘            │  └──────────────┘  │
└──────────┴───────────────────────────────────────────┴────────────────────┘
```

Version history (signature): top bar → `← Version history · <milestone>   [Back to current]`,
right panel = month-grouped timeline; résumé re-renders as-of the date, additions in green.

Deep-dive tab: pageless reading column — title + subtitle, then Overview / Demo (video) /
How it works (SVG diagram) / Results (metric tiles) / Stack (tags) / Links (chips).

Mobile (≤768): collapsed top bar (☰ title ☆ 🕘 💬 Share); tabs/outline in a left drawer;
comments as a bottom sheet with drag handle + prev/next; page fills width, no h-scroll.
