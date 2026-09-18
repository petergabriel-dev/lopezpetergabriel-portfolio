export interface FlowStep {
  label: string;
}

export interface Project {
  context: string;
  title: string;
  copy: string;
  tags: readonly string[];
  flow: readonly FlowStep[];
  migrationNote?: string;
}

export interface ExperienceEntry {
  key: "role" | "education";
  value: string;
  date: string;
  description?: string;
}

export interface ContactLink {
  label: string;
  href?: string;
}
