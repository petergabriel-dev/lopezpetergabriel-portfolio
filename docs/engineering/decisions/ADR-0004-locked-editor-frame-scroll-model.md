---
id: ADR-0004
title: Lock editor frame and keep scrolling in active panels
status: Active
date: 2026-09-19
---

# ADR-0004: Lock editor frame and keep scrolling in active panels

## Decision

- Lock the editor shell to `100dvh` with a `40rem` minimum block size.
- Keep header, wrapped tab row, and `StatusBar` reachable while the active panel owns normal-height scrolling.
- Wrap the tab row instead of adding horizontal tab scrolling or alternate navigation.
- Reset the newly active panel's `scrollTop` to `0` when the tab changes; preserve roving tabindex, ARIA state, and arrow-key focus behavior.
- Allow the document to scroll below the `40rem` shell minimum so short viewports do not clip the footer.
- Give the ProjectsPanel left-column card stack its own bounded vertical viewport as the third nested scroll owner alongside `RepoList` and `ContributionGrid`'s bounded viewports.

## Why

- `100dvh` tracks the visible viewport more accurately than `100vh` on mobile browsers.
- Panel-only scrolling keeps editor chrome available while visitors read long content.
- Wrapped tabs keep every file label available at narrow widths without two-dimensional page scrolling or a second navigation model.
- Resetting panel scroll removes stale hidden-panel positions without extra renders, scroll listeners, or focus movement.
- The `40rem` minimum is a deliberate short-viewport fallback: reachability is more important than preserving a locked frame below that height.

## Affects

Docs:

- `docs/engineering/invariants.md`
- `docs/engineering/conventions.md`
- `docs/engineering/traps.md`
- `docs/design/README.md`
- `docs/design/components.md`
- `docs/engineering/decisions/README.md`

Code:

- `app/tokens.css`
- `components/EditorShell.module.css`
- `components/EditorTabBar.module.css`
- `components/EditorTabBar.tsx`
- `components/panels/ProjectsPanel.module.css`
- `tests/accessibility.test.tsx`

## Consequences

- Good: header, tabs, active content, and status remain reachable at normal viewport heights.
- Good: narrow screens show complete tab labels without a horizontally scrolling tab row.
- Good: switching files starts each newly shown panel at its top without stealing focus.
- Good: light and dark themes share token-driven scrollbar styling.
- Good: long project lists scroll inside the left column while the GitHub column and editor frame stay visible.
- Bad/risk: very short viewports scroll the document and may show less of the shell at once; this is the intentional `40rem` fallback.
- Bad/risk: responsive frame height and scrollbar visibility require browser verification because jsdom does not model them.

## Read when

- changing editor shell sizing or page viewport units
- changing tab-row wrapping, panel overflow, or scrollbar styling
- changing the ProjectsPanel left-column viewport
- changing tab activation, panel mounting, or scroll restoration
- reviewing narrow-viewport accessibility or browser layout behavior

## Supersedes

- None
