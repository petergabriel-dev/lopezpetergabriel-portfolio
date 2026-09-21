---
id: ADR-0005
title: Use a committed GitHub snapshot for public activity
status: Active
date: 2026-09-19
---

# ADR-0005: Use a committed GitHub snapshot for public activity

## Decision

- Fetch `petergabriel-dev` public non-fork, non-archived repositories and the one-year contribution calendar with the manual `npm run sync:github` script.
- Validate both GitHub responses before writing the typed `content/github.ts` snapshot; keep the read-only PAT in gitignored local `.env.local` only.
- Sort repositories by pushed date, cap the snapshot at eight rows, show five rows at a time in the scrollable GitHub activity list, and render contribution totals and repository dates as static absolute UTC text.
- Keep `ProjectsPanel` server-rendered and make no GitHub request from the shipped app, CI, or client bundle.

## Why

- A committed snapshot preserves the static `/` route and prevents visitors from depending on GitHub availability or making a third-party request.
- Local-only credentials keep the repository, CI, generated content, and client bundle secret-free while allowing the owner to refresh public activity deliberately.
- Typed generated content makes the snapshot part of the normal typecheck and keeps UI rendering simple and server-only.
- A fixed one-year grid and eight-row cap keep the two-column panel readable as the account grows; an honest sync date makes deliberate staleness visible.

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

- `content/types.ts`
- `content/github.ts`
- `scripts/sync-github.mjs`
- `package.json`
- `app/tokens.css`
- `components/panels/ProjectsPanel.tsx`
- `components/RepoList.tsx`
- `components/RepoList.module.css`
- `components/ContributionGrid.tsx`
- `components/ContributionGrid.module.css`
- `tests/accessibility.test.tsx`

## Consequences

- Good: production builds remain static and visitors make no GitHub request.
- Good: CI needs no GitHub token; generated content contains only public activity and no credential.
- Good: absolute UTC dates and a visible sync date avoid misleading relative-time copy.
- Bad/risk: the snapshot becomes stale until the manual sync runs; the UI intentionally reports its sync date rather than hiding that fact.
- Bad/risk: PAT expiry, GitHub API changes, or contribution-query permissions can block a future refresh; the script fails locally before replacing content.
- Bad/risk: repository cap and one-year window omit older or longer-term activity by design; the five-row viewport adds a second scroll owner inside the panel.

## Read when

- changing GitHub data fetching, snapshot generation, or repository selection
- adding runtime network requests or CI credentials
- changing repository caps, contribution range, or date formatting
- changing the ProjectsPanel GitHub column or its overflow ownership

## Supersedes

- None
