import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/page-frame";
import { DeepDive } from "@/components/deepdive/deep-dive";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Brinks Home – Raghavsai Tirupati",
  description: "Software Engineer Intern on the C#/.NET checkout platform.",
  alternates: { canonical: `${SITE_URL}/brinks` },
};

export default function Page() {
  return (
    <PageFrame variant="deep-dive">
      <DeepDive tabId="brinks" />
    </PageFrame>
  );
}
