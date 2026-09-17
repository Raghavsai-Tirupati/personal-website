import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/page-frame";
import { DeepDive } from "@/components/deepdive/deep-dive";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "ACSI – Raghavsai Tirupati",
  description: "Open-source certification for LLM model swaps.",
  alternates: { canonical: `${SITE_URL}/acsi` },
};

export default function Page() {
  return (
    <PageFrame variant="deep-dive">
      <DeepDive tabId="acsi" />
    </PageFrame>
  );
}
