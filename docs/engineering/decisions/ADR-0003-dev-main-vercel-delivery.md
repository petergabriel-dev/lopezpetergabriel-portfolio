---
id: ADR-0003
title: Separate dev and main delivery with GitHub CI and Vercel
status: Active
date: 2026-09-18
---

# ADR-0003: Separate dev and main delivery with GitHub CI and Vercel

## Decision

- Use `dev` for direct development pushes and `main` for protected releases.
- Run one GitHub Actions quality job on `dev` pushes and `dev` → `main` pull requests.
- Keep deployment in Vercel rather than adding a deploy step or Vercel secret to Actions.
- Set Vercel production branch to `main` and align its Node major with `.nvmrc`; use `dev` for preview deployments.

## Why

- The workflow gives every dev commit a CI gate and separates preview work from the production branch.
- Main branch protection requires the `quality` check and a pull-request approval, preventing direct production pushes.
- Keeping deployment in Vercel avoids storing deployment credentials in GitHub Actions and uses the platform's Git integration for previews and production.
- We accept external dashboard configuration and the possibility of deployment settings drifting from repository configuration.

## Affects

Docs:

- `docs/engineering/dev-workflow.md`
- `docs/engineering/invariants.md`
- `docs/engineering/traps.md`

Code/config:

- `.github/workflows/ci.yml`
- `.nvmrc`
- `package.json`
- GitHub remote `git@github-personal:petergabriel-dev/lopezpetergabriel-portfolio.git`
- External Vercel project settings

## Consequences

- Good: Actions needs no Vercel secret and remains a single quality job.
- Good: direct main pushes are rejected; the required check and review are visible on the release PR.
- Good: dev and main can have distinct Vercel preview/production deployment paths.
- Bad/risk: Vercel branch, Node, and preview settings are outside version control and must be checked in the dashboard.
- Bad/risk: a failed CI run blocks the release PR until its source is fixed.

## Read when

- changing branches, CI triggers, or branch protection
- changing Vercel production/preview behavior
- adding a deployment step or secret to GitHub Actions

## Supersedes

- None
