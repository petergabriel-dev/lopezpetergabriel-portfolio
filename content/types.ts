export interface Project {
  context: string;
  title: string;
  copy: string;
  tags: readonly string[];
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
