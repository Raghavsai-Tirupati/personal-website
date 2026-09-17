# Self-critique

Final screenshots (`design/shots/`) compared against the current Docs UI. Differences found,
and how each was resolved.

## Fixed

- **Comment cards overlapped / drifted.** Added measured stacking (sort by anchor top, push
  down with a gap) so cards align to their line and never overlap, like Docs.
- **Version "Current version" row repeated its label**, and each entry had a redundant colour
  dot. Cleaned the row copy and removed the duplicate dot.
- **`::highlight()` find styles were dropped** by the Tailwind CSS parser → moved to a raw
  `<style>` so the CSS Custom Highlight API actually paints.
- **Print spilled to two pages and showed comment cards.** Added `no-print` to the comment
  layer and a print-only 0.9 zoom + 0.45in margins → one clean sheet, résumé only.
- **Accessibility (axe WCAG 2.1 A/AA): 12 → 0 non-minor violations.** Moved the "Last edit"
  button out of the `menubar` role; made disabled toolbar controls real `disabled` buttons
  (honest + exempt from the contrast rule while keeping the light Docs look); marked diagram
  SVGs decorative (a text caption already conveys them); made `#main` a labelled, focusable
  scroll region; raised the deep-dive "Added on" line to AA contrast.
- **Deep-dive pages were shifted left** by the comment-gutter reservation → scoped the gutter
  to the résumé route only.

## Justified (left as-is)

- **LCP 3.3 s on Lighthouse's throttled-mobile run** (Performance 92; A11y 98, Best Practices
  100, SEO 100, CLS 0, TBT 10 ms, FCP 0.8 s). All fonts self-host and finish ~20 ms; the
  résumé text is in the server HTML. The number is a lantern-simulation artifact of the mobile
  throttle, not a real stall — desktop is ~100. I chose not to strip fonts or fidelity to
  chase the last three points.
- **Anonymous "Narwhal" viewer** in the presence stack — non-essential but explicitly offered
  in the brief and very Docs-faithful; kept, tiny.
- **Placeholder version dates** render as normal dates in the panel with a subtle "date TBD"
  tag rather than being hidden, so the timeline reads cleanly while still flagging what to
  confirm (also listed in `TODO.md`).

## The one thing removed

Per the brief's "remove one thing that doesn't earn its place": the disabled **Align** and
**Checklist** icons at the right of the toolbar. They have no honest mapping in a view-only
résumé and only added noise before the Mode selector. Undo / redo / print / zoom / font /
bold-italic already communicate "doc editor in Viewing mode" clearly.

## Known deviations from the brief

- **Content is typed TS, not MDX.** The brief suggested MDX for write-ups. Because every
  deep-dive uses the same sober section set (Overview / Demo / How it works / Results / Stack /
  Links), typed data serves the stated goal better — edit content without touching components,
  and required fields are validated at build. Prose still lives in the content files.
- **Reference pass** was recreated from tokens rather than live-sampled (see `PLAN.md`).
