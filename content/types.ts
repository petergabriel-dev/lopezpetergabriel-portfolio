// Content contracts. Every record traces to the owner's master CV (local-only, see docs/design/README.md).

export type ProjectCategory = "Work" | "Independent" | "Academic";

export interface ProjectLink {
  href: string;
  label: string;
}

export interface Project {
  id: string;
  category: ProjectCategory;
  title: string;
  /** Full organization line, shown in the project dialog. */
  org: string;
  /** Short organization, shown on cards. */
  orgShort: string;
  period: string;
  summary: string;
  points: readonly string[];
  tags: readonly string[];
  link?: ProjectLink;
  featured?: boolean;
}

export interface Role {
  title: string;
  org: string;
  /** Employment type; absent when the CV does not state one. */
  kind?: "Full-time" | "Freelance" | "Part-time" | "Internship";
  location: string;
  /** Desktop card: large start year and compact range. */
  year: string;
  range: string;
  /** Mobile timeline: date/kind line and organization line. */
  timeline: {
    meta: string;
    org: string;
  };
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  years: string;
  honors: readonly string[];
}

export type HighlightIcon = "records" | "training" | "broadcast";

export interface Highlight {
  icon: HighlightIcon;
  text: string;
}

export interface ToolkitArea {
  area: "Backend" | "Automation" | "AI agents" | "Media";
  items: readonly string[];
  usedAt: string;
}

export interface ContactLink {
  kind: "email" | "phone" | "linkedin" | "github";
  label: string;
  value: string;
  href: string;
}

export interface TopicCard {
  title: string;
  text: string;
}

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  url: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface ContributionWeek {
  days: readonly ContributionDay[];
}

export interface GithubSnapshot {
  syncedAt: string;
  profileUrl: string;
  repos: readonly GithubRepo[];
  contributions: {
    total: number;
    weeks: readonly ContributionWeek[];
  };
}
