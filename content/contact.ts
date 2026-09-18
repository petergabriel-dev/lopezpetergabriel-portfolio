import type { ContactLink } from "./types";

export const contactContent = {
  eyebrow: "contact.md",
  heading: "Open a conversation",
  body: "No contact form. Send a direct note about an automation, backend, or AI-agent build.",
  availability: "available for contract work",
} as const;

export const contactLinks: readonly ContactLink[] = [
  {
    label: "lopezpetergabriel@gmail.com",
    href: "mailto:lopezpetergabriel@gmail.com",
  },
  {
    label: "github.com/petergabriel-dev",
    href: "https://github.com/petergabriel-dev",
  },
  {
    label: "LinkedIn — profile link pending before launch",
  },
];
