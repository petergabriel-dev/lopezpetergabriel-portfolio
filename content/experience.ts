import type { Education, Highlight, Role, ToolkitArea } from "./types";

// Copy from docs/design/storm-glass-handoff/design/Experience.dc.html (timeline lines from Mobile-Experience.dc.html).
export const experiencePage = {
  chip: "Experience · Currently",
  titleLines: ["Data Analyst", "at DILG Region VI"],
  body: "Full-time at DILG Region VI since June 2026. Before that: freelance and part-time automation for clients in the United Kingdom and Sweden, generative-media and automation work at Sieitz Innovations, and a CRM internship at Zenlabs.",
} as const;

export const highlights: readonly Highlight[] = [
  {
    icon: "records",
    text: "Leading design and development of a regional digital records and data warehouse platform in Laravel, MySQL and React.",
  },
  {
    icon: "training",
    text: "Resource person on data organization and management for monitoring and evaluating Local Government Support Fund (LGSF) projects.",
  },
  {
    icon: "broadcast",
    text: "General IT support, multimedia documentation, and livestream and audiovisual operations for events.",
  },
];

export const roles: readonly Role[] = [
  {
    title: "Data Analyst",
    org: "DILG Region VI",
    kind: "Full-time",
    location: "Iloilo City",
    year: "2026",
    range: "Jun–Present",
    timeline: { meta: "Jun 2026 – Present · Full-time", org: "DILG Region VI · Iloilo City" },
  },
  {
    title: "Freelance Automation Consultant",
    org: "Theory of Khaos",
    kind: "Freelance",
    location: "Remote, UK",
    year: "2026",
    range: "Jan–Jun",
    timeline: { meta: "Jan – Jun 2026 · Freelance, remote", org: "Theory of Khaos · UK brand strategy studio" },
  },
  {
    title: "Lead Automation Specialist",
    org: "Adsome (Stromberg Media AB)",
    kind: "Part-time",
    location: "Remote, Sweden",
    year: "2026",
    range: "Jan–Mar",
    timeline: { meta: "Jan – Mar 2026 · Part-time, remote", org: "Adsome (Stromberg Media AB) · Sweden" },
  },
  {
    title: "Multimedia Specialist & AI Automation Lead",
    org: "Sieitz Innovations OPC",
    location: "Iloilo City",
    year: "2025",
    range: "Aug–May ’26",
    timeline: { meta: "Aug 2025 – May 2026", org: "Sieitz Innovations OPC · Iloilo City" },
  },
  {
    title: "Automation Engineer & CRM Intern",
    org: "Zenlabs Venture Management Inc.",
    kind: "Internship",
    location: "Iloilo City",
    year: "2025",
    range: "Jan–May",
    timeline: { meta: "Jan – May 2025 · Internship", org: "Zenlabs Venture Management Inc. · Iloilo City" },
  },
];

export const education: Education = {
  degree: "BS Computer Science",
  school: "Iloilo Science and Technology University",
  year: "2025",
  years: "2021–2025",
  honors: ["TOPCIT Passer · 2025", "Dean's Lister · AY 2021–22"],
};

export const toolkit: readonly ToolkitArea[] = [
  {
    area: "Backend",
    items: ["Go · Docker", "PHP (Laravel) · MySQL", "React · TypeScript", "Python · REST APIs"],
    usedAt: "Used at DILG, Sieitz, Zenlabs and in pi-extensions",
  },
  {
    area: "Automation",
    items: ["n8n · Make.com", "GoHighLevel", "Folk CRM · Odoo · Mailchimp", "Stripe · Tally · Slack · Notion"],
    usedAt: "Used at Theory of Khaos, Adsome, Sieitz, Zenlabs",
  },
  {
    area: "AI agents",
    items: ["MCP · JSON-RPC · IPC", "Claude Code · Cursor · OpenCode", "Pi coding-agent subagents", "Multi-agent n8n workflows"],
    usedAt: "Used in pi-extensions, at Sieitz and Theory of Khaos",
  },
  {
    area: "Media",
    items: ["Google Veo · Seedream", "Premiere Pro · DaVinci Resolve", "Lightroom · Photoshop · Capture One", "Livestream and AV support"],
    usedAt: "Used at Sieitz and DILG",
  },
];
