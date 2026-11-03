import type { Metadata } from "next";

import { ProjectsView } from "@/components/views/ProjectsView";
import { projects } from "@/content/projects";
import { getGithubSnapshot } from "@/lib/github";

// Daily ISR: GitHub repos refresh server-side (ADR-0005).
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Government systems, client automations, generative-media pipelines and AI-agent infrastructure built by Peter Gabriel Lopez.",
};

export default async function ProjectsPage() {
  const snapshot = await getGithubSnapshot();
  return <ProjectsView projects={projects} snapshot={snapshot} />;
}
