import type { Project } from "./types";

export const projectsContent = {
  eyebrow: "projects.tsx",
  heading: "Selected builds",
} as const;

export const projects: readonly Project[] = [
  {
    context: "Sieitz Innovations",
    title: "Multi-Agent Branding Guide Generator",
    copy: "A coordinated research, strategy, and copy workflow that turns a trigger into a synced Notion branding guide.",
    tags: ["n8n", "Multi-Agent Orchestration", "Notion API", "AI Agents"],
  },
  {
    context: "DILG Region VI",
    title: "Regional Data Warehouse System",
    copy: "A digitization pipeline and backend system that moves paper records into a Laravel/MySQL service with a React dashboard.",
    tags: ["Laravel", "MySQL", "React", "Docker"],
  },
];
