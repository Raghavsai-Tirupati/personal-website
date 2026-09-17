import type { TabDef } from "./types";

// Small inline-SVG diagrams in the Docs drawing style. Kept deliberately plain:
// soft rounded boxes, thin connectors, one blue accent for the outcome.
const flow = (steps: { label: string; accent?: boolean }[]): string => {
  const boxW = 150;
  const gap = 34;
  const h = 60;
  const y = 30;
  const width = steps.length * boxW + (steps.length - 1) * gap;
  let x = 0;
  const parts: string[] = [];
  steps.forEach((s, i) => {
    const fill = s.accent ? "#e8f0fe" : "#f8fafd";
    const stroke = s.accent ? "#1a73e8" : "#c7d0da";
    const tc = s.accent ? "#174ea6" : "#3c4043";
    // wrap label into up to 3 lines of ~18 chars
    const words = s.label.split(" ");
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > 18) {
        lines.push(cur.trim());
        cur = w;
      } else cur = (cur + " " + w).trim();
    }
    if (cur) lines.push(cur);
    const startY = y + h / 2 - (lines.length - 1) * 8;
    const tspans = lines
      .map((l, li) => `<tspan x="${x + boxW / 2}" y="${startY + li * 16}">${l}</tspan>`)
      .join("");
    parts.push(
      `<rect x="${x}" y="${y}" width="${boxW}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>` +
        `<text x="${x + boxW / 2}" text-anchor="middle" font-size="12.5" fill="${tc}" font-family="var(--font-chrome)">${tspans}</text>`,
    );
    if (i < steps.length - 1) {
      const ax = x + boxW;
      parts.push(
        `<line x1="${ax + 6}" y1="${y + h / 2}" x2="${ax + gap - 6}" y2="${y + h / 2}" stroke="#9aa0a6" stroke-width="1.5"/>` +
          `<path d="M ${ax + gap - 6} ${y + h / 2} l -7 -4 v 8 z" fill="#9aa0a6"/>`,
      );
    }
    x += boxW + gap;
  });
  return `<svg viewBox="0 0 ${width} 120" width="100%" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${parts.join("")}</svg>`;
};

const TABS_DEFS: TabDef[] = [
  { id: "resume", label: "Résumé", route: "/", kind: "resume" },

  {
    id: "acsi",
    label: "ACSI",
    route: "/acsi",
    kind: "deep-dive",
    addedOn: "2026-07-16",
    subtitle: "Open-source certification for LLM model swaps",
    sections: [
      {
        kind: "prose",
        heading: "Overview",
        paragraphs: [
          "ACSI (AI Certification System Infrastructure) decides whether one model can safely replace another. It replays real LLM traffic through both the original and the candidate model and returns a pass or block verdict, backed by an ed25519-signed certificate.",
          "The reference benchmark certified an Opus 4.1 to Sonnet 5 swap on real GitHub issues from Kubernetes, VS Code, React, and Rust. The public BLOCK certificate at acsi.dev includes a downloadable cert.json with working signature verification.",
        ],
      },
      { kind: "video", heading: "Demo", videoId: "acsi" },
      {
        kind: "diagram",
        heading: "How it works",
        diagram: flow([
          { label: "Real LLM traces" },
          { label: "Replay through both models" },
          { label: "Contract check + judge ensemble" },
          { label: "Signed verdict", accent: true },
        ]),
        caption:
          "Each trace is replayed through both models, checked against a strict JSON schema, and scored by a cross-family judge ensemble. A contract break cannot hide behind good prose.",
      },
      {
        kind: "prose",
        heading: "The output contract",
        paragraphs: [
          "Every response must satisfy a JSON schema with required keys summary (max 400 chars), category, severity, affected_area (max 60), action_items (max 5), needs_more_info, and no additional properties.",
          "The largest failure clusters were summaries over 400 characters, affected_area over 60, too many action items, and code fences leaking into output. The noise floor first measures how much the original model varies on identical inputs, and a difference only counts as a regression if it clears that floor.",
        ],
      },
      {
        kind: "results",
        heading: "Results",
        items: [
          { label: "Contract break, candidate model", value: "53%", note: "of 279 real traces, vs 0 for the original" },
          { label: "Measured noise floor", value: "3.9%" },
          { label: "Failures after prompt fix", value: "149 → 18 → 5", note: "auto-pass withheld on the residual five" },
        ],
      },
      {
        kind: "stack",
        heading: "Stack",
        groups: [
          { label: "Core", items: ["Python", "LLM evaluation harness", "HDBSCAN"] },
          { label: "Certificates", items: ["ed25519 signing", "cert.json", "Apache-2.0"] },
        ],
      },
      { kind: "links", heading: "Links", links: ["acsi-repo", "acsi-cert"] },
    ],
  },

  {
    id: "iris",
    label: "Iris",
    route: "/iris",
    kind: "deep-dive",
    addedOn: "2025-11-08",
    subtitle: "1st place at Hook 'Em Hacks · camera to speech for blind users",
    sections: [
      {
        kind: "prose",
        heading: "Overview",
        paragraphs: [
          "Iris turns a phone camera into speech for blind and low-vision users. It won 1st place out of 250 teams at Hook 'Em Hacks in the Patient Centered track, built solo in 24 hours, and is live on the App Store.",
        ],
      },
      { kind: "video", heading: "Demo", videoId: "iris" },
      {
        kind: "diagram",
        heading: "How it works",
        diagram: flow([
          { label: "Live camera frame" },
          { label: "CV + multimodal agent" },
          { label: "Context-aware speech", accent: true },
        ]),
        caption:
          "Live frames feed a computer-vision pipeline that narrates the scene. A multimodal LLM agent answers follow-up questions about the surroundings, and an OCR mode reads signs, menus, books, and labels aloud in under 4 seconds.",
      },
      {
        kind: "results",
        heading: "Results",
        items: [
          { label: "Placement", value: "1st / 250", note: "Patient Centered track, built solo in 24h" },
          { label: "OCR spoken output", value: "< 4s" },
          { label: "Availability", value: "Live", note: "on the App Store" },
        ],
      },
      {
        kind: "stack",
        heading: "Stack",
        groups: [{ label: "Core", items: ["Swift", "React", "TypeScript", "Multimodal LLM", "OCR"] }],
      },
      { kind: "links", heading: "Links", links: ["iris-site", "iris-appstore"] },
    ],
  },

  {
    id: "matchbook",
    label: "Matchbook",
    route: "/matchbook",
    kind: "deep-dive",
    addedOn: "2026-01-15",
    subtitle: "A Java + Spring Boot order-matching trade engine",
    sections: [
      {
        kind: "prose",
        heading: "Overview",
        paragraphs: [
          "Matchbook is a Java and Spring Boot trading engine that matches buy and sell orders through backend APIs. It pairs a REST and WebSocket surface with PostgreSQL storage, packaged in Docker with CI.",
        ],
      },
      {
        kind: "diagram",
        heading: "How it works",
        diagram: flow([
          { label: "Client (REST / WebSocket)" },
          { label: "Matching engine" },
          { label: "PostgreSQL order book", accent: true },
        ]),
        caption:
          "A client-server architecture exposes REST and WebSocket APIs to the matching engine, which persists the order book in PostgreSQL. Order-matching logic is tested with JUnit and benchmarked with JMH for latency and edge cases.",
      },
      {
        kind: "stack",
        heading: "Stack",
        groups: [
          { label: "Core", items: ["Java", "Spring Boot", "PostgreSQL"] },
          { label: "Testing & ops", items: ["JUnit", "JMH", "Docker", "CI"] },
        ],
      },
      { kind: "links", heading: "Links", links: ["matchbook-repo"] },
    ],
  },

  {
    id: "clinicalhours",
    label: "ClinicalHours",
    route: "/clinicalhours",
    kind: "deep-dive",
    addedOn: "2025-10-01",
    subtitle: "Clinical opportunities for pre-med students, onboarding for hospitals",
    sections: [
      {
        kind: "prose",
        heading: "Overview",
        paragraphs: [
          "ClinicalHours helps pre-med students find clinical opportunities and helps hospitals automate volunteer onboarding and credentialing. It grew to 1,000+ registered students and 9,500+ indexed clinical facilities.",
        ],
      },
      { kind: "video", heading: "Demo", videoId: "clinicalhours" },
      {
        kind: "diagram",
        heading: "How it works",
        diagram: flow([
          { label: "88K+ CMS + HRSA records" },
          { label: "Dedup by name / city / state" },
          { label: "Resumable enrichment, 50 states" },
          { label: "9,500+ unique facilities", accent: true },
        ]),
        caption:
          "A React, TypeScript, and Postgres platform with Cloudflare routing manages postings and applications. The facility index is built by an ingestion pipeline that merges federal records with checkpointed, resumable enrichment across all 50 states.",
      },
      {
        kind: "results",
        heading: "Results",
        items: [
          { label: "Registered students", value: "1,000+" },
          { label: "Indexed facilities", value: "9,500+", note: "merged from 88K+ records" },
          { label: "Onboarding time reduced", value: "70%+" },
        ],
      },
      {
        kind: "stack",
        heading: "Stack",
        groups: [{ label: "Core", items: ["React", "TypeScript", "PostgreSQL", "Cloudflare"] }],
      },
      { kind: "links", heading: "Links", links: ["clinicalhours-site"] },
    ],
  },

  {
    id: "brinks",
    label: "Brinks Home",
    route: "/brinks",
    kind: "deep-dive",
    addedOn: "2026-05-18",
    subtitle: "Software Engineer Intern · C#/.NET checkout platform",
    sections: [
      {
        kind: "prose",
        heading: "Overview",
        paragraphs: [
          "As a Software Engineer Intern at Brinks Home, I work on the C#/.NET checkout platform that serves more than a million customers, continuing part-time through Fall 2026. This write-up stays at technique level, with no internal ticket IDs, code, screenshots, or proprietary details.",
        ],
      },
      {
        kind: "diagram",
        heading: "How it works",
        diagram: flow([
          { label: "Incoming message" },
          { label: "x-death bounded retry" },
          { label: "Persist completion state" },
          { label: "Publish once", accent: true },
        ]),
        caption:
          "The RabbitMQ fix used bounded retries based on the x-death header and persisted completion state before publishing, preventing duplicate workflow processing. CI ran in GitHub Actions and diagnostic logs lived in Azure Application Insights.",
      },
      {
        kind: "results",
        heading: "Results",
        items: [
          { label: "eContract recovery", value: "200+/mo", note: "expired order amendments restored" },
          { label: "Test coverage on CI/CD", value: "90%", note: "gating production releases" },
          { label: "Platform scale", value: "1M+", note: "customers served" },
        ],
      },
      {
        kind: "stack",
        heading: "Stack",
        groups: [
          { label: "Core", items: ["C#", ".NET", "RabbitMQ"] },
          { label: "Ops", items: ["Azure Application Insights", "GitHub Actions"] },
        ],
      },
    ],
  },
];

// Display / navigation order for the tabs rail (Résumé first, then as requested).
const TAB_ORDER = ["resume", "clinicalhours", "acsi", "iris", "matchbook", "brinks"] as const;
export const TABS: TabDef[] = TAB_ORDER.map((id) => TABS_DEFS.find((t) => t.id === id)!);

export const TABS_BY_ID: Record<string, TabDef> = Object.fromEntries(
  TABS.map((t) => [t.id, t]),
);

export const DEEP_DIVE_TABS = TABS.filter((t) => t.kind === "deep-dive");
