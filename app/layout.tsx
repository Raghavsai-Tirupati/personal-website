import type { Metadata, Viewport } from "next";
import "./globals.css";
import { chromeFont, bodyFont } from "./fonts";
import { AppShell } from "@/components/chrome/app-shell";
import { getLastEditISO } from "@/lib/git";
import { validateContent } from "@/lib/content";
import { SITE_URL, DOC_TITLE, OWNER } from "@/lib/config";

// Validate content and surface TODOs in the build output.
const todos = validateContent();
if (todos.length && typeof window === "undefined") {
  // eslint-disable-next-line no-console
  console.log(
    `\n[content] ${todos.length} TODO item(s):\n` +
      todos.map((t) => `  • (${t.area}) ${t.detail}`).join("\n") +
      "\n",
  );
}

const description =
  "Raghavsai Tirupati, Software Engineer in Dallas. Software Engineer Intern at Brinks Home and Founding Software Engineer at ClinicalHours. Projects: ACSI, Iris, and Matchbook.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DOC_TITLE,
  description,
  applicationName: "Raghavsai Tirupati – Résumé",
  authors: [{ name: OWNER.name, url: SITE_URL }],
  openGraph: {
    type: "profile",
    title: DOC_TITLE,
    description,
    url: SITE_URL,
    siteName: DOC_TITLE,
  },
  twitter: { card: "summary_large_image", title: DOC_TITLE, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: OWNER.name,
  jobTitle: OWNER.role,
  email: `mailto:${OWNER.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Dallas", addressRegion: "TX" },
  url: SITE_URL,
  sameAs: [OWNER.linkedin, OWNER.github],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Texas A&M University" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lastEditISO = getLastEditISO();
  return (
    <html lang="en" className={`${chromeFont.variable} ${bodyFont.variable} h-full`}>
      <body className="h-full">
        {/* CSS Custom Highlight API rules (dropped by the Tailwind CSS parser). */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              "::highlight(find-match){background:#fce8b2;color:#1f1f1f}::highlight(find-current){background:#f9ab00;color:#1f1f1f}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <AppShell lastEditISO={lastEditISO}>{children}</AppShell>
      </body>
    </html>
  );
}
