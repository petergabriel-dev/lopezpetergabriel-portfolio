import type { ContactLink, TopicCard } from "./types";

// Copy from docs/design/storm-glass-handoff/design/Contact.dc.html.
export const contactPage = {
  titleLines: ["Open a", "conversation"],
  body: "No contact form. Send a direct note about an automation, backend, or AI-agent build.",
  topicsLabel: "Good things to write about",
} as const;

export const location = {
  city: "Iloilo City, Philippines",
  timeZone: "Asia/Manila",
  utcOffset: "UTC+8",
  languages: ["English", "Filipino", "Hiligaynon"],
} as const;

export const contactLinks = {
  email: {
    kind: "email",
    label: "Email",
    value: "lopezpetergabriel@gmail.com",
    href: "mailto:lopezpetergabriel@gmail.com",
  },
  phone: {
    kind: "phone",
    label: "Phone · Philippines, UTC+8",
    value: "+63 976 126 0783",
    href: "tel:+639761260783",
  },
  linkedin: {
    kind: "linkedin",
    label: "LinkedIn",
    value: "in/peter-gabriel-lopez-702646393",
    href: "https://www.linkedin.com/in/peter-gabriel-lopez-702646393",
  },
  github: {
    kind: "github",
    label: "GitHub",
    value: "github.com/petergabriel-dev",
    href: "https://github.com/petergabriel-dev",
  },
} as const satisfies Record<ContactLink["kind"], ContactLink>;

/** Contact page order. */
export const directLines: readonly ContactLink[] = [
  contactLinks.email,
  contactLinks.phone,
  contactLinks.linkedin,
  contactLinks.github,
];

export const topics: readonly TopicCard[] = [
  { title: "Automation", text: "n8n, Make.com and GoHighLevel workflows" },
  { title: "Backend", text: "Go, Laravel/PHP and Python services" },
  { title: "AI agents", text: "MCP integrations, AI-agent and multi-agent workflows" },
];
