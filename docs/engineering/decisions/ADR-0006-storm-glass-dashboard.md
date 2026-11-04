---
id: ADR-0006
title: Replace the editor UI with the Storm Glass dashboard
status: Active
date: 2026-11-03
readWhen: Change the Storm Glass shell, routes, navigation, theme, breakpoint, fonts, content scope, or project dialog.
---

# ADR-0006: Replace the editor UI with the Storm Glass dashboard

> **Partly superseded by ADR-0007** (2026-11-04). The scrolling clause ("The page scrolls normally…") is replaced: the frame is locked to the viewport and content scrolls inside columns. ADR-0007 also removes the frame's maximum width and moves the Projects filters into an "All projects" dialog. Every other decision here remains active.

## Decision

- Replace the four-tab code-editor UI with the Storm Glass frosted-glass dashboard specified in `docs/design/storm-glass-handoff/`: a rounded frame over a backdrop plus scrim, a glass nav rail, a header, and section-plus-aside content.
- Ship on the gradient-and-hatch stand-in backdrop; a real photo can replace it later without blocking launch. Keep the scrim with any future photo.
- Dark only. Remove `ThemeToggle`, the pre-paint theme resolver in `app/layout.tsx`, the persisted `portfolio-theme` value, and the light/dark token blocks.
- Serve four static App Router routes, `/`, `/projects`, `/experience` and `/contact`, from one shared root layout. Navigation is real links with `aria-current="page"`; the `tablist`/`tab`/`tabpanel` model and roving tabindex are removed.
- The page scrolls normally. The frame has `min-height: 100dvh` and grows with content; there are no nested scroll owners, and the contribution grid fits its width instead of scrolling sideways.
- Use one mobile-first shell breakpoint at `760px` because the mobile shell is structurally different (labeled nav bar, header without action buttons). Inside sections, intrinsic `auto-fit` grids stay the rule.
- Self-host Plus Jakarta Sans (300–700) and Geist Mono (400–500) through `next/font/google`, replacing Inter and JetBrains Mono.
- Expand source-backed content to 11 projects, 5 roles, 1 education record, a four-area toolkit and 3 DILG highlights, all traced to `docs/design/storm-glass-handoff/reference/Peter_Gabriel_Lopez_Master_CV.md`.
- LinkedIn renders as a link, and a phone number is added as a `tel:` link on Contact.
- Project details open in a native `<dialog>` via `showModal()` from Projects cards and Home "Selected work" buttons.

## Why

- The owner commissioned the Storm Glass redesign; the editor metaphor no longer matches how the portfolio should present the work.
- Separate static routes keep the "static App Router site" rule, give shareable URLs and working back/forward navigation, and allow per-page metadata without client-side section switching.
- The design has no light variant. Keeping a theme system would mean inventing an unreviewed light glass palette and doubling every glass, scrim and contribution token.
- Normal document scrolling removes the three nested scroll owners that ADR-0004 needed and that were hard to verify at narrow widths.
- Native `<dialog>` provides focus containment, an inert background and Escape handling without a dependency.
- A single breakpoint is the smallest exception that matches the design's structurally different mobile shell; everything else stays intrinsic.

## Affects

Docs:

- `docs/engineering/invariants.md`
- `docs/engineering/conventions.md`
- `docs/engineering/architecture.md`
- `docs/engineering/dev-workflow.md`
- `docs/engineering/traps.md`
- `docs/design/README.md`
- `docs/design/components.md`
- `docs/design/manifest.json`
- `docs/engineering/decisions/ADR-0004-locked-editor-frame-scroll-model.md`
- `docs/engineering/decisions/README.md`

Code:

- `app/layout.tsx`
- `app/globals.css`
- `app/tokens.css`
- `app/page.tsx`
- `app/projects/page.tsx`
- `app/experience/page.tsx`
- `app/contact/page.tsx`
- `components/` (AppShell, SectionNav, icons, LocalTimeCard, ContributionGrid, ProjectCard, TagChip, ProjectDialog, ProjectGrid, FeaturedProjects, RepoList, Highlights, ToolkitGrid, ResumeCard, RoleList, EducationCard, ContactLine, views)
- `content/types.ts`, `content/about.ts`, `content/projects.ts`, `content/experience.ts`, `content/contact.ts`
- `public/headshot.webp`, `public/resume.pdf`, `resume/resume.html`
- `tests/`

## Consequences

- Good: shareable section URLs, per-route titles, and a simpler scroll model with no nested viewports.
- Good: less code: the theme script, theme toggle, typing headline, status bar and tab keyboard logic are deleted.
- Good: client JavaScript is limited to navigation state, the local-time clock, project filters and the dialog.
- Bad/risk: visitors who prefer a light theme get dark only.
- Bad/risk: `backdrop-filter` glass costs GPU time on low-end devices and needs the `-webkit-` prefix for Safari.
- Bad/risk: caption contrast was designed against the stand-in backdrop and must be checked again when a real photo ships.
- Bad/risk: one width media query is an exception to the auto-fit-only convention and must stay the only one.

## Read when

- changing the app shell, nav rail, mobile nav, or route structure
- reintroducing a theme toggle or light theme
- adding a breakpoint or nested scroll area
- changing fonts, glass tokens, or the backdrop and scrim
- changing project dialog behavior or the content scope

## Supersedes

- ADR-0004
