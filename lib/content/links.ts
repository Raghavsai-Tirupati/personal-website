import type { LinkDef, LinkId } from "./types";
import { OWNER } from "@/lib/config";

// Smart-chip / link-preview registry. Favicons and thumbnails are local files
// under /public/link (generated placeholders until real screenshots are added).
export const LINKS: Record<LinkId, LinkDef> = {
  email: {
    id: "email",
    href: `mailto:${OWNER.email}`,
    label: OWNER.email,
    title: "Email Raghavsai Tirupati",
    domain: "mail",
    favicon: "/link/favicon-mail.svg",
  },
  linkedin: {
    id: "linkedin",
    href: OWNER.linkedin,
    label: OWNER.linkedinLabel,
    title: "Raghavsai Tirupati",
    domain: "linkedin.com",
    favicon: "/link/favicon-linkedin.svg",
  },
  github: {
    id: "github",
    href: OWNER.github,
    label: OWNER.githubLabel,
    title: "Raghavsai-Tirupati",
    domain: "github.com",
    favicon: "/link/favicon-github.svg",
  },
  "iris-site": {
    id: "iris-site",
    href: "https://iris.how",
    label: "iris.how",
    title: "Iris — sight through sound",
    domain: "iris.how",
    favicon: "/link/favicon-iris.svg",
    thumbnail: "/link/thumb-iris-site.svg",
  },
  "iris-appstore": {
    id: "iris-appstore",
    href: "https://apps.apple.com/us/app/iris-sight/id6762914469",
    label: "App Store",
    title: "Iris - Sight on the App Store",
    domain: "apps.apple.com",
    favicon: "/link/favicon-appstore.svg",
  },
  "acsi-repo": {
    id: "acsi-repo",
    href: "https://github.com/Raghavsai-Tirupati/acsi-engine",
    label: "acsi-engine",
    title: "Raghavsai-Tirupati/acsi-engine",
    domain: "github.com",
    favicon: "/link/favicon-github.svg",
    thumbnail: "/link/thumb-acsi-repo.svg",
  },
  "acsi-cert": {
    id: "acsi-cert",
    href: "https://acsi.dev/cert/opus-4-1-to-sonnet-5",
    label: "acsi.dev/cert",
    title: "BLOCK certificate — Opus 4.1 → Sonnet 5",
    domain: "acsi.dev",
    favicon: "/link/favicon-acsi.svg",
    thumbnail: "/link/thumb-acsi-cert.svg",
  },
  "matchbook-repo": {
    id: "matchbook-repo",
    href: "https://github.com/Raghavsai-Tirupati/trading-engine",
    label: "trading-engine",
    title: "Raghavsai-Tirupati/trading-engine",
    domain: "github.com",
    favicon: "/link/favicon-github.svg",
  },
  "clinicalhours-site": {
    id: "clinicalhours-site",
    href: "#",
    label: "ClinicalHours",
    title: "ClinicalHours",
    domain: "clinicalhours",
    favicon: "/link/favicon-clinicalhours.svg",
    todo: "Live ClinicalHours site URL not supplied.",
  },
};

export function getLink(id: LinkId): LinkDef {
  return LINKS[id];
}
