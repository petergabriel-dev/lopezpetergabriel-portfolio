import type { Metadata } from "next";

import { projectsPage } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Government systems, client automations, generative-media pipelines and AI-agent infrastructure built by Peter Gabriel Lopez.",
};

export default function ProjectsPage() {
  return <h1>{projectsPage.title}</h1>;
}
