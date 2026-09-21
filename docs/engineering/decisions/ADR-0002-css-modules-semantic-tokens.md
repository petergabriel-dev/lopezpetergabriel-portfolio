---
id: ADR-0002
title: Use CSS Modules with semantic design tokens
status: Active
date: 2026-09-18
---

# ADR-0002: Use CSS Modules with semantic design tokens

## Decision

- Keep primitives and theme roles in `app/tokens.css`.
- Style components and panels with colocated CSS Modules.
- Consume semantic custom properties in component styles; do not add Tailwind or another styling dependency.

## Why

- The design source already defines primitive scales and semantic light/dark roles.
- CSS Modules scope component selectors without introducing a runtime styling layer.
- Semantic variables let one component contract work in both themes and keep color, spacing, type, radius, border, and motion choices reviewable in one token file.
- Tailwind could speed utility composition, but would add a dependency and move the implementation away from the supplied token roles. We accept more explicit CSS files and class declarations instead.

## Affects

Docs:

- `docs/design/tokens.css`
- `docs/design/README.md`
- `docs/engineering/conventions.md`
- `docs/engineering/invariants.md`

Code:

- `app/tokens.css`
- `app/globals.css`
- `components/*.module.css`
- `components/panels/*.module.css`
- `package.json`

## Consequences

- Good: theme changes are semantic-token changes, not per-component color rewrites.
- Good: CSS remains local to the component that owns the markup and responsive overflow.
- Bad/risk: repeated layout declarations are more verbose than utility classes.
- Bad/risk: a raw literal can bypass the token contract unless lint/review and browser checks catch it.

## Read when

- adding or styling a component or panel
- adding a new color, spacing, radius, border, or motion value
- changing theme selectors or responsive overflow ownership

## Supersedes

- None
