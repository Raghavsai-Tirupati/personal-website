import type { Metadata } from "next";
import { PageFrame } from "@/components/chrome/page-frame";
import { DeepDive } from "@/components/deepdive/deep-dive";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "ClinicalHours – Raghavsai Tirupati",
  description: "Clinical opportunities for pre-med students; onboarding for hospitals.",
  alternates: { canonical: `${SITE_URL}/clinicalhours` },
};

export default function Page() {
  return (
    <PageFrame variant="deep-dive">
      <DeepDive tabId="clinicalhours" />
    </PageFrame>
  );
}
