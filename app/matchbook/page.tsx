import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/page-frame";
import { DeepDive } from "@/components/deepdive/deep-dive";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Matchbook – Raghavsai Tirupati",
  description: "Java + Spring Boot order-matching trade engine.",
  alternates: { canonical: `${SITE_URL}/matchbook` },
};

export default function Page() {
  return (
    <PageFrame variant="deep-dive">
      <DeepDive tabId="matchbook" />
    </PageFrame>
  );
}
