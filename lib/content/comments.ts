import type { Comment } from "./types";
import { OWNER } from "@/lib/config";

const author = OWNER.name;
const authorColor = OWNER.color;

// Comment threads = short deep dives, anchored to résumé phrases. Content is
// drawn only from the deep-dive notes in the brief (technique level, no
// internal ticket IDs, code, or proprietary details).
export const COMMENTS: Comment[] = [
  {
    id: "brinks-econtract",
    tab: "resume",
    anchorPhrase: "200+ expired order amendments",
    author,
    authorColor,
    dateLabel: "May 21",
    body: "The eContract recovery restores order amendments that expire before checkout completes, roughly 200 a month that would otherwise need manual re-entry. It runs inside the C#/.NET checkout workflow on a platform serving more than a million customers.",
    openTab: "brinks",
  },
  {
    id: "brinks-rabbitmq",
    tab: "resume",
    anchorPhrase: "RabbitMQ retry edge case",
    author,
    authorColor,
    dateLabel: "Jun 3",
    body: "The fix used bounded retries keyed on the x-death header and persisted completion state before publishing, so a message could not be processed twice. CI ran in GitHub Actions and the diagnostic logs lived in Azure Application Insights.",
    openTab: "brinks",
  },
  {
    id: "clinicalhours-index",
    tab: "resume",
    anchorPhrase: "9,500+ unique facilities",
    author,
    authorColor,
    dateLabel: "Oct 4",
    body: "The facility index merges 88K+ federal CMS and HRSA records down to 9,500+ unique facilities. Deduplication is by name, city, and state, and the enrichment runs are checkpointed and resumable across all 50 states.",
    chips: ["clinicalhours-site"],
    openTab: "clinicalhours",
  },
  {
    id: "acsi-contract",
    tab: "resume",
    anchorPhrase: "53% of 279 real traces",
    author,
    authorColor,
    dateLabel: "Jul 18",
    body: "Replaying 279 real traces, the swapped model broke the required JSON contract on 53% of them, versus 0 for the original. Separate blind judges (non-Anthropic LLMs) still scored the new answers as good or better on every pair, so a quality-only review would have missed the regression.",
    chips: ["acsi-cert"],
    openTab: "acsi",
  },
  {
    id: "acsi-noise-floor",
    tab: "resume",
    anchorPhrase: "3.9% noise floor",
    author,
    authorColor,
    dateLabel: "Jul 20",
    body: "The noise floor measures how much the original model's own answers vary on identical inputs, here 3.9%. A difference only counts as a regression if it clears that floor. HDBSCAN clustered 149 failures, and a prompt fix drove them from 149 to 18 to 5 on re-certification, with the certifier withholding auto-pass on the residual five.",
    chips: ["acsi-repo"],
    openTab: "acsi",
  },
  {
    id: "iris-ocr",
    tab: "resume",
    anchorPhrase: "under 4 seconds",
    author,
    authorColor,
    dateLabel: "Nov 9",
    body: "The OCR reading mode covers signs, menus, books, and labels, returning spoken output in under 4 seconds. The follow-up mode uses a multimodal LLM agent to answer questions about the surroundings with context-aware speech.",
    chips: ["iris-site"],
    openTab: "iris",
  },
  {
    id: "iris-award",
    tab: "resume",
    anchorPhrase: "1st Place at Hook 'Em Hacks",
    author,
    authorColor,
    dateLabel: "Nov 9",
    body: "Iris was built solo in 24 hours and took 1st place out of 250 teams in the Patient Centered track. It is live on the App Store.",
    chips: ["iris-appstore"],
    openTab: "iris",
  },
];

export const COMMENTS_BY_ID: Record<string, Comment> = Object.fromEntries(
  COMMENTS.map((c) => [c.id, c]),
);

export function commentsForTab(tab: string): Comment[] {
  return COMMENTS.filter((c) => c.tab === tab);
}
