import type { Project } from "./types";

export const projectsContent = {
  eyebrow: "projects.tsx",
  heading: "What I've built",
} as const;

export const projects: readonly Project[] = [
  {
    context: "DILG Region VI",
    title: "Regional Data Warehouse System",
    copy: "A digitization pipeline and backend system that moves paper records into a Laravel/MySQL service with a React dashboard.",
    tags: ["Laravel", "MySQL", "React", "Git"],
  },
  {
    context: "Adsome (Stromberg Media AB)",
    title: "Production Automation Systems",
    copy: "Design and maintain n8n, GoHighLevel, and AI-agent workflows for lead nurturing, reporting, and content pipelines, documented for handoff.",
    tags: ["n8n", "GoHighLevel", "AI Agents", "Lead Nurturing"],
  },
  {
    context: "Theory of Khaos",
    title: "Client Intake & CRM Migration",
    copy: "End-to-end intake in Make.com capturing Stripe payments and Tally submissions, routed into Folk CRM then migrated to GoHighLevel, plus an n8n workflow mining closed-deal leads.",
    tags: ["Make.com", "Stripe", "Folk CRM", "GoHighLevel", "n8n"],
  },
  {
    context: "Sieitz Innovations",
    title: "AI Content & Multimedia Pipelines",
    copy: "n8n pipelines wiring Google Veo and Seedream into image, video, and audio generation, plus a multi-agent branding-guide workflow with Notion sync and a Dockerized Go backend.",
    tags: ["n8n", "Go", "Docker", "Multi-Agent Orchestration", "Notion API"],
  },
  {
    context: "Zenlabs",
    title: "Internsheet & CRM Automation",
    copy: "Full-stack contributions to the Internsheet platform with GoHighLevel and Odoo automations for lead management.",
    tags: ["GoHighLevel", "Odoo", "CRM", "Full-Stack"],
  },
];
