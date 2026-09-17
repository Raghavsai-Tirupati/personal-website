import type { ResumeContent } from "./types";
import { OWNER } from "@/lib/config";

// Source of truth for the résumé. `addedOn` dates drive version history; they
// represent when a line entered the document, not necessarily when the work
// happened. Excludes GPA, phone number, and the research role by design.
export const RESUME: ResumeContent = {
  header: {
    name: OWNER.name,
    location: "Dallas, TX",
    contactChips: ["email", "linkedin", "github"],
  },

  educationHeading: "Education",
  education: [
    {
      id: "tamu",
      school: "Texas A&M University",
      degree: "Bachelor of Science in Computer Science + Biomedical Sciences",
      dates: "Expected May 2029",
      addedOn: "2025-08-18",
    },
  ],
  honors: [
    {
      id: "honor-tidalhack",
      text: "Best Use of Gemini API at TidalHack",
      addedOn: "2025-10-25",
    },
    {
      id: "honor-hookem",
      text: "1st Place at Hook 'Em Hacks",
      addedOn: "2025-11-08",
      anchors: [{ phrase: "1st Place at Hook 'Em Hacks", commentId: "iris-award" }],
    },
  ],

  experienceHeading: "Experience",
  experience: [
    {
      id: "brinks",
      org: "Brinks Home",
      role: "Software Engineer Intern",
      location: "Dallas, TX",
      dates: "May 2026 – Present",
      addedOn: "2026-05-18",
      tab: "brinks",
      bullets: [
        {
          id: "brinks-b1",
          addedOn: "2026-05-18",
          text: "Implemented C#/.NET checkout workflow changes for a platform serving 1M+ customers, including an eContract recovery that restores 200+ expired order amendments monthly and recurring-billing updates for service-plan and address changes.",
          bold: ["C#/.NET", "200+"],
          anchors: [{ phrase: "200+ expired order amendments", commentId: "brinks-econtract" }],
        },
        {
          id: "brinks-b2",
          addedOn: "2026-05-18",
          text: "Resolved a RabbitMQ retry edge case by adding explicit completed-state checks to prevent duplicate workflow processing.",
          bold: ["RabbitMQ"],
          anchors: [{ phrase: "RabbitMQ retry edge case", commentId: "brinks-rabbitmq" }],
        },
        {
          id: "brinks-b3",
          addedOn: "2026-08-25",
          text: "Wrote unit/regression tests at 90% code coverage for CI/CD pipelines with sharded retries, gating production releases.",
          bold: ["90%", "CI/CD"],
        },
        {
          id: "brinks-b4",
          addedOn: "2026-08-25",
          text: "Diagnosed workflow failures across APIs, RabbitMQ queues, and .NET services using Azure logs to isolate root causes.",
        },
      ],
    },
    {
      id: "clinicalhours",
      org: "ClinicalHours",
      role: "Founding Software Engineer",
      location: "College Station, TX",
      dates: "Oct 2025 – Present",
      addedOn: "2025-10-01",
      tab: "clinicalhours",
      bullets: [
        {
          id: "ch-b1",
          addedOn: "2025-10-01",
          text: "Launched a web platform to help pre-med students find clinical opportunities, while also helping hospitals automate volunteer onboarding/credentialing, growing to 1,000+ registered student users and 9,500+ indexed clinical facilities.",
          bold: ["1,000+", "9,500+"],
        },
        {
          id: "ch-b2",
          addedOn: "2025-10-01",
          text: "Built a React, TypeScript, and Postgres platform with Cloudflare routing to manage clinical job postings & applications.",
          bold: ["React, TypeScript", "Postgres"],
        },
        {
          id: "ch-b3",
          addedOn: "2025-10-01",
          text: "Reduced clinic volunteer onboarding time by 70%+, replacing manual credentialing checklists with automated workflows.",
          bold: ["70%+"],
        },
        {
          id: "ch-b4",
          addedOn: "2025-10-01",
          text: "Built the ingestion pipeline behind the facility index, merging 88K+ federal CMS and HRSA records into 9,500+ unique facilities in Postgres via name/city/state deduplication and checkpointed, resumable enrichment runs across all 50 states.",
          bold: ["88K+", "9,500+", "Postgres", "50 states"],
          anchors: [{ phrase: "9,500+ unique facilities", commentId: "clinicalhours-index" }],
        },
      ],
    },
  ],

  projectsHeading: "Projects",
  projects: [
    {
      id: "acsi",
      name: "ACSI (AI Certification System Infrastructure)",
      meta: "Python, LLM Evaluation, HDBSCAN",
      addedOn: "2026-07-16",
      tab: "acsi",
      titleChips: ["acsi-repo", "acsi-cert"],
      bullets: [
        {
          id: "acsi-b1",
          addedOn: "2026-07-16",
          text: "Built an open-source tool that replays real LLM traffic to evaluate model swaps and return pass/block verdicts.",
        },
        {
          id: "acsi-b2",
          addedOn: "2026-07-16",
          text: "Caught a swapped model silently breaking the JSON contract on 53% of 279 real traces, versus 0 for the original model, while blind judges (separate LLMs) still scored the new model's answers as good or better on every pair.",
          bold: ["53%", "279", "0"],
          anchors: [{ phrase: "53% of 279 real traces", commentId: "acsi-contract" }],
        },
        {
          id: "acsi-b3",
          addedOn: "2026-07-20",
          text: "Measured a 3.9% noise floor, clustered 149 failures with HDBSCAN, and validated a prompt fix by re-certifying (149 → 18 → 5 failures), with the certifier correctly withholding auto-pass on the residual five.",
          bold: ["3.9%", "149 → 18 → 5", "149"],
          anchors: [{ phrase: "3.9% noise floor", commentId: "acsi-noise-floor" }],
        },
      ],
    },
    {
      id: "iris",
      name: "Iris, 1st Place at Hook 'Em Hacks",
      meta: "Swift, React, TypeScript",
      addedOn: "2025-11-08",
      tab: "iris",
      titleChips: ["iris-site", "iris-appstore"],
      bullets: [
        {
          id: "iris-b1",
          addedOn: "2025-11-08",
          text: "Shipped a first-place iOS computer-vision application that turns live camera input into speech for blind users.",
          bold: ["iOS"],
        },
        {
          id: "iris-b2",
          addedOn: "2025-11-08",
          text: "Integrated a multimodal LLM agent to answer follow-ups about users' surroundings with context-aware speech.",
        },
        {
          id: "iris-b3",
          addedOn: "2025-11-08",
          text: "Added an OCR reading mode for signs, menus, books, and labels, returning spoken text output in under 4 seconds.",
          bold: ["4 seconds"],
          anchors: [{ phrase: "under 4 seconds", commentId: "iris-ocr" }],
        },
      ],
    },
    {
      id: "matchbook",
      name: "Matchbook Trade Engine",
      meta: "Java, Spring Boot, PostgreSQL, JUnit, JMH, Docker",
      addedOn: "2026-01-15",
      tab: "matchbook",
      titleChips: ["matchbook-repo"],
      bullets: [
        {
          id: "mb-b1",
          addedOn: "2026-01-15",
          text: "Created a Java and Spring Boot trading engine that matches buy and sell orders through backend APIs.",
        },
        {
          id: "mb-b2",
          addedOn: "2026-01-15",
          text: "Designed client-server architecture with REST/WebSocket APIs, PostgreSQL storage, Docker, and CI.",
        },
        {
          id: "mb-b3",
          addedOn: "2026-01-15",
          text: "Tested order-matching logic with JUnit and JMH to validate correctness, latency, and edge-case behavior.",
        },
      ],
    },
  ],

  skillsHeading: "Technical skills",
  skills: [
    { label: "Languages", items: ["Python", "TypeScript", "Go", "Java", "C++", "SQL", "C#", "Swift", "R"] },
    { label: "Frameworks & Libraries", items: ["Spring Boot", ".NET", "Node.js", "React", "Next.js"] },
    { label: "Tools", items: ["Linux", "Docker", "AWS", "Azure", "Git", "MySQL", "PostgreSQL", "REST APIs"] },
    { label: "Development", items: ["Agile/Scrum", "unit & regression testing", "CI/CD", "REST API design", "Jira"] },
  ],
};
