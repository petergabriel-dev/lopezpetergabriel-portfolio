---
id: ADR-0005
title: Refresh GitHub activity with daily ISR and a committed snapshot fallback
status: Active
date: 2026-11-03
readWhen: Change GitHub data fetching, revalidation, fallback, snapshot generation, token handling, or repository selection.
---

# ADR-0005: Refresh GitHub activity with daily ISR and a committed snapshot fallback

> **Amended 2026-11-03** (originally 2026-09-19, "Use a committed GitHub snapshot for public activity"). The manual-only snapshot became the fallback seed for server-side daily revalidation.

## Decision

- `/` (contribution grid) and `/projects` (recent repositories) stay prerendered and set `export const revalidate = 86400`. On revalidation, Next fetches `petergabriel-dev`'s public non-fork, non-archived repositories and the one-year contribution calendar server-side.
- The GitHub token is a server-only `GITHUB_TOKEN`. It lives in gitignored `.env.local` for local work and in Vercel Production and Preview environment variables for deployments. It never uses a `NEXT_PUBLIC_` prefix and never appears in the repository, CI, generated content, logs, error messages or the client bundle.
- `lib/github-api.mjs` is the one shared fetch, validation and normalization module. `scripts/sync-github.mjs` and the server loader `lib/github.ts` both use it.
- The committed `content/github.ts` stays as the fallback seed, refreshed with `npm run sync:github`. Fallback rules:
  - no token, or a blank one → serve the committed snapshot;
  - fetch or validation failure during `next build` → warn without the token and serve the committed snapshot, so builds never fail on GitHub;
  - fetch or validation failure during runtime revalidation → throw, so ISR keeps serving the last successfully generated page and retries on the next request.
- The snapshot and fetch cap stays at eight repositories sorted by pushed date. The UI shows the six most recent with no scrolling.
- Visitors' browsers never request GitHub. Contribution totals and repository dates render as absolute UTC text.

## Why

- The owner wants the contribution grid and repository list to stay current without manual syncs before every release.
- Daily ISR keeps pages prerendered and fast while refreshing in the background, with no cron job, deploy hook or bot commits. A scheduled Action would have to get past `main` branch protection.
- Throwing at runtime is load-bearing. The installed Next docs say a failed revalidation keeps the last good page. Returning the old snapshot instead would make ISR cache stale data as a fresh page.
- The committed snapshot keeps local dev, CI and tests token-free and deterministic, and gives the first build a safe value if GitHub is unavailable.
- One shared parser prevents the sync script and the runtime loader from drifting apart.

## Affects

Docs:

- `docs/engineering/invariants.md`
- `docs/engineering/conventions.md`
- `docs/engineering/architecture.md`
- `docs/engineering/dev-workflow.md`
- `docs/engineering/traps.md`
- `docs/design/README.md`
- `docs/design/components.md`
- `docs/engineering/decisions/README.md`

Code:

- `lib/github-api.mjs`
- `lib/github.ts`
- `scripts/sync-github.mjs`
- `content/types.ts`
- `content/github.ts`
- `app/page.tsx`
- `app/projects/page.tsx`
- `components/RepoList.tsx`
- `components/ContributionGrid.tsx`
- `lib/contributions.ts`
- `tests/github-data.test.ts`
- `vitest.config.ts`

## Consequences

- Good: grid and repositories refresh at most once a day with no manual step; visitors still make no third-party request.
- Good: dev, CI and tests need no token and stay deterministic on the committed snapshot.
- Good: a GitHub outage never breaks a build or blanks a page.
- Bad/risk: deployments need a token in Vercel env. If it expires or is revoked, runtime revalidation keeps the last good page indefinitely (silently stale) until the token is rotated. Build-phase warnings in Vercel logs are the signal.
- Bad/risk: builds that have a token depend on GitHub latency, and fall back to the committed snapshot if it is down.
- Bad/risk: ISR is not observable in `next dev`; verify with `next build` output and preview deployments.
- Bad/risk: the eight-row cap and one-year window still omit older activity by design.

## Read when

- changing GitHub data fetching, revalidation interval, or fallback rules
- adding or rotating the GitHub token, or adding CI credentials
- changing repository caps, contribution range, or date formatting
- changing the RepoList or ContributionGrid data source

## Supersedes

- None (amends the original 2026-09-19 decision in place)
