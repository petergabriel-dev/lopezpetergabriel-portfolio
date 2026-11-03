import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { afterEach, describe, expect, it, vi } from "vitest";

import { githubSnapshot } from "@/content/github";
import { getGithubSnapshot } from "@/lib/github";
import { fetchGithubSnapshot } from "@/lib/github-api.mjs";

const TOKEN = "test-token-not-real";

const repo = (name: string, pushedAt: string, extra: Record<string, unknown> = {}) => ({
  name,
  description: null,
  language: "TypeScript",
  stargazers_count: 0,
  updated_at: pushedAt,
  pushed_at: pushedAt,
  html_url: `https://github.com/petergabriel-dev/${name}`,
  fork: false,
  archived: false,
  ...extra,
});

const calendar = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 3,
          weeks: [
            {
              contributionDays: [
                { date: "2026-01-04", contributionCount: 0, contributionLevel: "NONE" },
                { date: "2026-01-05", contributionCount: 3, contributionLevel: "FOURTH_QUARTILE" },
              ],
            },
          ],
        },
      },
    },
  },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, statusText: status === 200 ? "OK" : "Unauthorized" });
}

function fakeFetch(repos: unknown, graphql: unknown) {
  return vi.fn(async (url: string | URL) =>
    String(url).includes("/graphql") ? jsonResponse(graphql) : jsonResponse(repos),
  ) as unknown as typeof fetch;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getGithubSnapshot fallback rules", () => {
  it("uses the committed snapshot without a token", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(getGithubSnapshot()).resolves.toBe(githubSnapshot);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("treats a blank token as missing", async () => {
    vi.stubEnv("GITHUB_TOKEN", "   ");
    vi.stubGlobal("fetch", vi.fn());

    await expect(getGithubSnapshot()).resolves.toBe(githubSnapshot);
  });

  it("falls back to the snapshot and warns when the fetch fails during build", async () => {
    vi.stubEnv("GITHUB_TOKEN", TOKEN);
    vi.stubEnv("NEXT_PHASE", PHASE_PRODUCTION_BUILD);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await expect(getGithubSnapshot()).resolves.toBe(githubSnapshot);
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0][0])).not.toContain(TOKEN);
  });

  it("throws at runtime so ISR keeps the last good page", async () => {
    vi.stubEnv("GITHUB_TOKEN", TOKEN);
    vi.stubEnv("NEXT_PHASE", "phase-production-server");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ message: "Bad credentials" }, 401)),
    );

    const error = await getGithubSnapshot().then(
      () => null,
      (reason: unknown) => reason,
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("GitHub request failed: 401 Unauthorized");
    expect((error as Error).message).not.toContain(TOKEN);
  });
});

describe("fetchGithubSnapshot", () => {
  it("normalizes repositories and the contribution calendar", async () => {
    const repos = [
      repo("older", "2026-01-01T00:00:00Z"),
      repo("newer", "2026-02-01T00:00:00Z", { language: null }),
      repo("forked", "2026-03-01T00:00:00Z", { fork: true }),
      repo("archived", "2026-03-01T00:00:00Z", { archived: true }),
      ...Array.from({ length: 10 }, (_, i) => repo(`bulk-${i}`, "2025-06-01T00:00:00Z")),
    ];

    const snapshot = await fetchGithubSnapshot({ token: TOKEN, fetchImpl: fakeFetch(repos, calendar) });

    expect(snapshot.profileUrl).toBe("https://github.com/petergabriel-dev");
    expect(snapshot.repos).toHaveLength(8);
    expect(snapshot.repos.slice(0, 2).map((r) => r.name)).toEqual(["newer", "older"]);
    expect(snapshot.repos[0].language).toBeNull();
    expect(snapshot.repos.some((r) => r.name === "forked" || r.name === "archived")).toBe(false);
    expect(snapshot.contributions).toEqual({
      total: 3,
      weeks: [
        {
          days: [
            { date: "2026-01-04", count: 0, level: 0 },
            { date: "2026-01-05", count: 3, level: 4 },
          ],
        },
      ],
    });
  });

  it("rejects a malformed GraphQL payload", async () => {
    await expect(
      fetchGithubSnapshot({ token: TOKEN, fetchImpl: fakeFetch([], { errors: [{ message: "boom" }] }) }),
    ).rejects.toThrow("GitHub GraphQL response contains errors");
  });

  it("rejects a repository URL outside the profile", async () => {
    const repos = [repo("evil", "2026-01-01T00:00:00Z", { html_url: "https://example.com/petergabriel-dev/evil" })];

    await expect(fetchGithubSnapshot({ token: TOKEN, fetchImpl: fakeFetch(repos, calendar) })).rejects.toThrow(
      "GitHub response has invalid evil URL",
    );
  });

  it("requires a token", async () => {
    await expect(fetchGithubSnapshot({ token: " " })).rejects.toThrow("GitHub token is required");
  });
});
