---
id: ADR-0007
title: Lock the Storm Glass frame to the viewport with column scrolling
status: Active
date: 2026-11-04
readWhen: Change page, frame or column scrolling, frame sizing, view column flex bases, the Projects page card count, the "All projects" list dialog, or nav rail stacking.
---

# ADR-0007: Lock the Storm Glass frame to the viewport with column scrolling

## Decision

- The document never scrolls at any viewport size, phones included. `html` has `overflow: hidden` and `overscroll-behavior: none`, and the shell is exactly `100dvh` tall.
- Desktop (≥ 760px): the frame fills the viewport minus a 12px gutter (`--space-page`), with no maximum width. The rounded glass frame stays. Mobile keeps its full-bleed frame.
- Header and navigation stay pinned. On desktop that is the rail plus the header; on mobile the header and the four-up nav bar stay at the top, where they are today.
- `main#content` is the base scroller and an inline-size container named `content`. While a route's two columns are stacked (content width < 848px: phones and roughly 760–1024px viewports), it is the only scroller.
- At ≥ 848px content width (`@container content (min-width: 848px)` on the shared view row), the two columns sit side by side and each scrolls on its own; `main#content` no longer overflows. 848 = main column basis 520 + side column basis 300 + gap 28.
- Content is never scaled or hidden by viewport height. A column that does not fit scrolls.
- Home and Contact columns stretch to the frame height: the hero stays at the top, and the contribution grid (Home) and topic cards (Contact) sit at the bottom through the existing `justify-content: space-between`.
- A width token caps the contribution grid so its cells stop growing on very wide screens.
- `/projects` shows the 3 featured projects (the same ones as Home "Selected work") and a "More projects" button with the remaining count. The button opens a native `<dialog>`, "All projects", that lists every project as a compact row with the category filters inside it. A row opens the existing project dialog stacked above the list. Closing it returns focus to the row, with the list and the active filter intact. Previous/Next still cycles all projects.
- The desktop nav rail stacks above column content so its tooltips are never covered.

## Why

- The owner wants the portfolio to feel like a terminal or app window that fits the screen, not a scrolling page (discuss session, 2026-11-04).
- The 1360px cap left empty gutters on large screens; a full-width frame uses the available space.
- Column scrolling keeps the header and navigation on screen and lets the Experience roles column scroll independently of the main column.
- A container query switches the scroll owner without a second width breakpoint, and columns only scroll independently when they actually sit side by side.
- A fixed set of three cards plus a list dialog keeps the Projects page within one screen without measuring JavaScript. Moving the filters into the dialog stops a filtered set from overflowing the page again.
- Inner column scrolling was chosen over shrinking or hiding content by height: nothing is clipped, and no per-route priority rules are needed.
- This revisits the locked frame of ADR-0004 (superseded), with fewer scroll owners and no tab panels.

## Affects

Docs:

- `docs/engineering/invariants.md`
- `docs/engineering/conventions.md`
- `docs/engineering/architecture.md`
- `docs/engineering/traps.md`
- `docs/design/README.md`
- `docs/design/components.md`
- `docs/engineering/decisions/ADR-0006-storm-glass-dashboard.md`
- `docs/engineering/decisions/README.md`

Code:

- `app/tokens.css`
- `app/globals.css`
- `components/AppShell.tsx`
- `components/AppShell.module.css`
- `components/views/View.module.css`
- `components/ContributionGrid.module.css`
- `components/ProjectCard.tsx`
- `components/ProjectCard.module.css`
- `components/ProjectGrid.tsx`
- `components/ProjectGrid.module.css`
- `components/SectionNav.module.css`
- `tests/projects.test.tsx`

## Consequences

- Good: header and navigation are always visible, and no route scrolls the page.
- Good: wide screens are fully used, and the Projects page fits one screen with every project two taps away.
- Bad/risk: nested scroll owners return after ADR-0006 removed them. They need browser QA at narrow widths, short heights and in Chromium, Firefox and WebKit, because jsdom models none of it.
- Bad/risk: `html { overflow: hidden }` turns a layout bug into clipped content instead of page scroll. QA must assert that the document's `scrollHeight` equals the viewport height.
- Bad/risk: WebKit may not let keyboard users scroll a column with no focusable content. Verify, and fall back to a labelled focusable region if needed.
- Bad/risk: the 848px threshold is coupled to the column flex bases and the gap; change them together.
- Bad/risk: iOS Safari's address bar and overscroll behavior cannot be emulated and need a real-device check.
- Bad/risk: stacked native dialogs are not modelled by jsdom; the keyboard path is verified in a browser.

## Read when

- changing page, frame or column scrolling, or frame sizing
- changing column flex bases or the section gap in view modules
- changing the Projects page card count, the list dialog or the filters
- adding a scroll area or a breakpoint

## Supersedes

- ADR-0006, scrolling clause only. Its other decisions remain active.
