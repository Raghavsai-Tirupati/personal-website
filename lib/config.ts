// Single source of truth for the deployed origin. Change this one value when you
// deploy; Share -> Copy link, canonical metadata, and OG image all read from it.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const OWNER = {
  name: "Raghavsai Tirupati",
  firstName: "Raghavsai",
  role: "Software Engineer",
  location: "Dallas, TX",
  email: "ragtirup@gmail.com",
  linkedin: "https://www.linkedin.com/in/raghavsait",
  linkedinLabel: "linkedin.com/in/raghavsait",
  github: "https://github.com/Raghavsai-Tirupati",
  githubLabel: "github.com/Raghavsai-Tirupati",
  initials: "RT",
  // Color of the presence ring / author dot, matching a Docs collaborator color.
  color: "#0B57D0",
} as const;

export const DOC_TITLE = "Raghavsai Tirupati – Résumé";

// Flip to true once a web résumé (no GPA, no phone, no research) is added at
// public/resume.pdf. Until then, Download shows a "not added yet" state.
export const RESUME_PDF_READY = false;
export const RESUME_PDF_PATH = "/resume.pdf";
