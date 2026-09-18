---
id: ADR-0001
title: Use Next.js App Router for the portfolio site
status: Active
date: 2026-09-18
---

# ADR-0001: Use Next.js App Router for the portfolio site

## Decision

- Use Next.js 16 App Router with TypeScript for the site route.
- Keep `/` statically prerendered and keep runtime data fetching and API routes out of the request path.
- Use `next/font` for self-hosted Inter and JetBrains Mono.

## Why

- The site needs a small amount of React state for tabs, theme, and the headline reveal, plus a component boundary for each accessible panel.
- Next provides the App Router, static build/typecheck integration, and self-hosted font pipeline in the selected stack.
- Vanilla HTML or Astro could avoid shipping a React runtime for mostly static content. We accept that runtime cost because the implementation already needs React client boundaries and the route remains statically served.

## Affects

Docs:

- `docs/engineering/architecture.md`
- `docs/engineering/dev-workflow.md`
- `docs/engineering/conventions.md`

Code:

- `package.json`
- `next.config.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `components/EditorTabBar.tsx`
- `components/ThemeToggle.tsx`
- `components/TypingHeadline.tsx`

## Consequences

- Good: the route is statically prerendered and `next build` verifies TypeScript before delivery.
- Good: font files are bundled through `next/font` rather than requested from a runtime font host.
- Bad/risk: the page ships a React/Next runtime even though most content is static.
- Bad/risk: framework-generated types and App Router behavior must be considered on fresh CI checkouts.

## Read when

- changing the framework or route rendering mode
- adding a server/client component boundary
- changing font loading or build output

## Supersedes

- None
