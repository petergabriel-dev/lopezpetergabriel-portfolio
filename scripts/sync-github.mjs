/* global console, fetch, process, URL */

import { writeFile } from "node:fs/promises";

const USERNAME = "petergabriel-dev";
const PROFILE_URL = `https://github.com/${USERNAME}`;
const OUTPUT_URL = new URL("../content/github.ts", import.meta.url);
const API_HEADERS = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "lopezpetergabriel-portfolio-sync",
};

const contributionLevels = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`GitHub response has invalid ${label}`);
  }

  return value;
}

function githubDate(value, label) {
  const date = requiredString(value, label);

  if (Number.isNaN(Date.parse(date))) {
    throw new Error(`GitHub response has invalid ${label}`);
  }

  return date;
}

function githubUrl(value, label) {
  const url = requiredString(value, label);
  const parsed = new URL(url);

  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== "github.com" ||
    !parsed.pathname.startsWith(`/${USERNAME}/`)
  ) {
    throw new Error(`GitHub response has invalid ${label}`);
  }

  return url;
}

async function requestJson(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...API_HEADERS,
      ...init.headers,
    },
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }

  if (text.trim() === "") {
    throw new Error("GitHub request returned an empty response");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("GitHub request returned malformed JSON");
  }
}

function normalizeRepo(repo) {
  if (!isRecord(repo)) {
    throw new Error("GitHub repo response contains a malformed record");
  }

  if (typeof repo.fork !== "boolean" || typeof repo.archived !== "boolean") {
    throw new Error("GitHub repo response contains invalid repository flags");
  }

  const name = requiredString(repo.name, "repository name");
  const description = repo.description === null ? null : requiredString(repo.description, "repository description");
  const language = repo.language === null ? null : requiredString(repo.language, "repository language");
  const stars = repo.stargazers_count;

  if (!Number.isInteger(stars) || stars < 0) {
    throw new Error(`GitHub response has invalid stars for ${name}`);
  }

  const updatedAt = githubDate(repo.updated_at, `${name} updated date`);
  const pushedAt = repo.pushed_at === null ? updatedAt : githubDate(repo.pushed_at, `${name} pushed date`);

  return {
    name,
    description,
    language,
    stars,
    pushedAt,
    url: githubUrl(repo.html_url, `${name} URL`),
    fork: repo.fork,
    archived: repo.archived,
  };
}

function normalizeContributions(body) {
  if (!isRecord(body) || (Array.isArray(body.errors) && body.errors.length > 0)) {
    throw new Error("GitHub GraphQL response contains errors");
  }

  const data = body.data;
  const user = isRecord(data) ? data.user : null;
  const collection = isRecord(user) ? user.contributionsCollection : null;
  const calendar = isRecord(collection) ? collection.contributionCalendar : null;

  if (!isRecord(calendar)) {
    throw new Error("GitHub GraphQL response has no contribution calendar");
  }

  const total = calendar.totalContributions;
  const rawWeeks = calendar.weeks;

  if (!Number.isInteger(total) || total < 0 || !Array.isArray(rawWeeks) || rawWeeks.length === 0) {
    throw new Error("GitHub contribution calendar is empty or malformed");
  }

  const weeks = rawWeeks.map((week) => {
    if (!isRecord(week) || !Array.isArray(week.contributionDays) || week.contributionDays.length === 0) {
      throw new Error("GitHub contribution calendar contains a malformed week");
    }

    return {
      days: week.contributionDays.map((day) => {
        if (!isRecord(day)) {
          throw new Error("GitHub contribution calendar contains a malformed day");
        }

        const level = contributionLevels[day.contributionLevel];
        const count = day.contributionCount;

        if (
          !Number.isInteger(count) ||
          count < 0 ||
          !Number.isInteger(level) ||
          level < 0 ||
          level > 4
        ) {
          throw new Error("GitHub contribution calendar contains invalid day values");
        }

        return {
          date: githubDate(day.date, "contribution date").slice(0, 10),
          count,
          level,
        };
      }),
    };
  });

  return { total, weeks };
}

async function syncGithub() {
  const token = process.env.GITHUB_TOKEN?.trim();

  if (!token) {
    throw new Error("GITHUB_TOKEN is required in .env.local");
  }

  const reposUrl = new URL(`https://api.github.com/users/${USERNAME}/repos`);
  reposUrl.searchParams.set("per_page", "100");
  reposUrl.searchParams.set("sort", "pushed");
  reposUrl.searchParams.set("direction", "desc");

  const rawRepos = await requestJson(reposUrl);

  if (!Array.isArray(rawRepos)) {
    throw new Error("GitHub repository response is malformed");
  }

  const repos = rawRepos
    .map(normalizeRepo)
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((first, second) => {
      const dateDifference = Date.parse(second.pushedAt) - Date.parse(first.pushedAt);
      return dateDifference || first.name.localeCompare(second.name);
    })
    .slice(0, 8)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stars,
      pushedAt: repo.pushedAt,
      url: repo.url,
    }));

  const graphqlBody = await requestJson("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ContributionCalendar($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    contributionLevel
                    date
                  }
                }
              }
            }
          }
        }
      `,
      variables: { login: USERNAME },
    }),
  });

  const snapshot = {
    syncedAt: new Date().toISOString(),
    profileUrl: PROFILE_URL,
    repos,
    contributions: normalizeContributions(graphqlBody),
  };

  const output = `import type { GithubSnapshot } from "./types";\n\nexport const githubSnapshot: GithubSnapshot = ${JSON.stringify(snapshot, null, 2)};\n`;
  await writeFile(OUTPUT_URL, output, "utf8");
  console.log(`Wrote ${OUTPUT_URL.pathname}`);
}

try {
  await syncGithub();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
