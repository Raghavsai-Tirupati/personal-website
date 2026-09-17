import { RESUME } from "./resume";
import { LINKS } from "./links";
import { VIDEOS } from "./videos";
import { VERSIONS } from "./versions";
import { COMMENTS } from "./comments";
import { TABS } from "./tabs";

export type TodoItem = { area: string; detail: string };

// Extra content TODOs that are not encoded as flags on individual records.
const MANUAL_TODOS: TodoItem[] = [
  { area: "content", detail: "ACSI deep-dive copy is drawn from the brief but is flagged 'verify before publishing'." },
  { area: "content", detail: "Iris deep-dive figures ('solo in 24h', '1st of 250') are flagged 'verify with me'." },
  { area: "asset", detail: "Résumé PDF: add web version (no GPA, phone, or research) at public/resume.pdf." },
  { area: "asset", detail: "Link-preview thumbnails are generated placeholders; swap for real screenshots in public/link/." },
  { area: "asset", detail: "Optional headshot for the presence avatar: public/avatar.jpg." },
];

// Throws on missing required fields; returns the full TODO list for the report.
export function validateContent(): TodoItem[] {
  const errors: string[] = [];
  const todos: TodoItem[] = [];

  const req = (cond: boolean, msg: string) => {
    if (!cond) errors.push(msg);
  };

  // Résumé required fields.
  req(!!RESUME.header.name, "resume.header.name is empty");
  const allBullets = [
    ...RESUME.experience.flatMap((e) => e.bullets),
    ...RESUME.projects.flatMap((p) => p.bullets),
  ];
  for (const b of allBullets) {
    req(!!b.text?.trim(), `resume bullet ${b.id} has empty text`);
    req(!!b.addedOn, `resume bullet ${b.id} missing addedOn`);
  }

  // Comment anchors must resolve to a real comment.
  const commentIds = new Set(COMMENTS.map((c) => c.id));
  const anchored = [
    ...RESUME.honors.flatMap((h) => h.anchors ?? []),
    ...allBullets.flatMap((b) => b.anchors ?? []),
  ];
  for (const a of anchored) {
    req(commentIds.has(a.commentId), `anchor references unknown comment '${a.commentId}'`);
  }

  // Collect TODO flags.
  for (const l of Object.values(LINKS)) {
    if (l.todo) todos.push({ area: `link:${l.id}`, detail: l.todo });
  }
  for (const v of Object.values(VIDEOS)) {
    if (v.todo) todos.push({ area: `video:${v.id}`, detail: v.todo });
  }
  for (const v of VERSIONS) {
    if (v.dateTodo) todos.push({ area: `version-date`, detail: `Confirm date for "${v.title}" (using ${v.id}).` });
  }
  todos.push(...MANUAL_TODOS);

  if (errors.length) {
    throw new Error("Content validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  }

  // Silence unused import in case TABS is only referenced for its side effects.
  void TABS.length;
  return todos;
}
