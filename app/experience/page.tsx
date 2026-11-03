import type { Metadata } from "next";

import { experiencePage } from "@/content/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Roles, toolkit and education of Peter Gabriel Lopez, Data Analyst at DILG Region VI and automation specialist.",
};

export default function ExperiencePage() {
  return <h1>{experiencePage.titleLines.join(" ")}</h1>;
}
