// Copy from docs/design/storm-glass-handoff/design/Main.dc.html. Availability confirmed by the owner (2026-11-03).
export const aboutContent = {
  name: "Peter Gabriel Lopez",
  initials: "PL",
  role: "Software Engineer & Automation Specialist",
  titleLines: ["Useful systems", "over noisy demos."],
  body: "Backend and full-stack development, AI-agent infrastructure, API integrations and CRM automation across Go, PHP/Laravel, Python, TypeScript, React, MySQL, Docker, n8n, Make.com and GoHighLevel. I've delivered internal systems for a regional Philippine government office and technical solutions for clients in the United Kingdom and Sweden.",
  availability: {
    /** Home time card detail, rendered as three dot-separated parts. */
    parts: ["Available", "Contract", "Across timezones"],
    /** Contact chip. */
    chip: "Available for contract work",
    /** Mobile Experience timeline "Now" row. */
    timelineTitle: "Open for contract work",
    timelineNote: "Across timezones, alongside the day job",
  },
} as const;
