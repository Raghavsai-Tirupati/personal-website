import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/page-frame";
import { DeepDive } from "@/components/deepdive/deep-dive";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Iris – Raghavsai Tirupati",
  description: "1st place at Hook 'Em Hacks. Camera to speech for blind users.",
  alternates: { canonical: `${SITE_URL}/iris` },
};

export default function Page() {
  return (
    <PageFrame variant="deep-dive">
      <DeepDive tabId="iris" />
    </PageFrame>
  );
}
