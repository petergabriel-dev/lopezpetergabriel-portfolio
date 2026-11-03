import type { Metadata } from "next";

import { ExperienceView } from "@/components/views/ExperienceView";
import { getResumeSizeLabel } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Roles, toolkit and education of Peter Gabriel Lopez, Data Analyst at DILG Region VI and automation specialist.",
};

export default function ExperiencePage() {
  return <ExperienceView resumeSize={getResumeSizeLabel()} />;
}
