// Server-only GitHub loader for the ISR routes / and /projects (ADR-0005).
// Import only from server components or route files; never from 'use client' modules.
import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { githubSnapshot } from "@/content/github";
import type { GithubSnapshot } from "@/content/types";

import { fetchGithubSnapshot } from "./github-api.mjs";

/**
 * - No token (local dev, CI, tests) -> committed snapshot.
 * - Fetch fails during `next build` -> warn + committed snapshot, so builds never fail on GitHub.
 * - Fetch fails during runtime revalidation -> throw, so ISR keeps serving the last good page
 *   instead of caching the old snapshot as fresh data.
 */
export async function getGithubSnapshot(): Promise<GithubSnapshot> {
  const token = process.env.GITHUB_TOKEN?.trim();

  if (!token) {
    return githubSnapshot;
  }

  try {
    return await fetchGithubSnapshot({ token });
  } catch (error) {
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
      const reason = error instanceof Error ? error.message : "unknown error";
      console.warn(`GitHub fetch failed during build; using the committed snapshot. ${reason}`);
      return githubSnapshot;
    }

    throw error;
  }
}
