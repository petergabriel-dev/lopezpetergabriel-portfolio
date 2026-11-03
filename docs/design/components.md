# Storm Glass component contracts

All components consume semantic tokens from `app/tokens.css`. These are role contracts, not markup. Breakpoint means the single `760px` shell breakpoint; layouts are mobile-first. Any state not listed is not applicable to that component.

## AppShell (server)

**Anatomy:** skip link → `SectionNav` → column with `header` and `main#content`. The frame paints the backdrop plus scrim.

**Desktop:**
- Frame is a grid of a 64 px rail and the main column, gap `--space-section`; max width `--size-frame-max`; radius `--radius-frame`; `overflow: clip`; `--shadow-frame`.
- Header shows "Portfolio of" (mono caption) over the name (semibold `p`).
- Header actions are 46 px glass icon links (`--glass-icon-*`, `--blur-icon`): Résumé (`/resume.pdf`, `download`), GitHub (`rel="noopener noreferrer"`), Email (`mailto:`). The 52 px avatar has a 2 px light ring.

**Mobile:** grid areas place the header (decorative PL mark, name, 44 px avatar; no focusables) above the nav bar. Content stacks at 20 px gaps.

**Accessibility:**
- One `header`, one `nav`, one `main`.
- "Skip to content" is visible on focus.
- Icon links are named "Download résumé (PDF)", "GitHub profile" and "Email Peter".
- Avatar alt is "Peter Gabriel Lopez".

**Motion:** none.

## SectionNav (client)

**Anatomy:** `nav aria-label="Sections"` with links About `/`, Projects `/projects`, Experience `/experience`, Contact `/contact`.

**Variants:**
- Desktop rail: PL logo link, four 48 × 48 icon items (`--radius-nav-item`), and a bordered résumé download at the bottom. Labels are visually hidden and show as a tooltip on hover and focus-visible; no `title` attribute.
- Mobile bar: four columns of 56 px items, icon over an 11 px label. Logo and résumé items are hidden.

**States:**
- default;
- hover: `--glass-hover-fill`, pointer-gated;
- focus-visible: ring;
- current: `aria-current="page"`, `--glass-nav-active-fill`, `--color-content-strong`.

**Tokens:** `--glass-nav-fill`, `--glass-nav-border`, `--blur-nav`, `--radius-nav`, `--size-nav-item`, `--size-logo`, `--font-size-micro`.

**Motion:** hover fill only (`--motion-duration-hover`).

## Icons

Named exports live in `components/icons.tsx`. Each is a 24 × 24 viewBox, `stroke="currentColor"`, width 1.6–1.8, round caps and joins, `aria-hidden="true"`, `focusable="false"`. Paths come from the design files. GitHub uses a branch icon; there are no brand logos.

## LocalTimeCard (client)

**Anatomy:**
- pin + "Iloilo City, Philippines";
- large `HH:mm` (24-hour, `Asia/Manila`) beside "UTC+8";
- "{Weekday} · Peter's local time";
- a detail line.

**Variants:**
- `availability`: accent dot + "Available · Contract · Across timezones";
- `languages`: "English · Filipino · Hiligaynon".

**States:** loading shows `--:--` on the server and first paint, with the weekday omitted. Default shows the live time, refreshed every 15 s.

**Tokens:** `--glass-feature-*`, `--blur-feature`, `--shadow-feature`, `--radius-feature`, `--font-size-clock` (64 → 76), `--tracking-clock`.

**Accessibility:** `time` gets `dateTime` after mount; no live region. The dot is decorative.

**Motion:** none.

## ContributionGrid (server)

**Anatomy:** `figure` > visible `figcaption` (range and totals) → `aria-hidden` grid → visible busiest-day footer and an `aria-hidden` Less → More legend.

**Variants:**
- `year` (desktop):
  - 26 px Mon/Wed/Fri label column and a 53-column month row;
  - caption "GitHub contributions · {start} – {end}" and "{total} in the past year · {active} active days";
  - footer "Busiest day: {n} on {date}".
- `recent` (mobile):
  - last 26 weeks, 2 px gap, no day labels;
  - caption "GitHub contributions · last 26 weeks" and "{n} since {date} · {total} in the past year".

**Layout:** Home renders both variants, one hidden per breakpoint. Cells use `grid-auto-flow: column`, 7 rows, `minmax(0, 1fr)` columns and `aspect-ratio: 1`, so the grid fits its width with no scroll.

**States:**
- default;
- empty: "No GitHub activity recorded", no cells.

**Tokens:** `--color-contribution-0` … `-4`, `--shadow-contribution-top`, `--radius-cell` (2 → 3).

**Rules:** every figure is derived from the data, in UTC. Cell `title` reads "No contributions on …", "1 contribution on …" or "N contributions on …".

**Motion:** none.

## ProjectCard

**Base:** `button type="button"` with `aria-haspopup="dialog"`. It contains phrasing content only: tags are spans, not a list.

**Variants:**
- `grid` (≥ 760 px): number and category pill, title, "orgShort · period", summary clamped to 3 lines, first three tags, expand icon, min height `--size-card-min`.
- `compact` (< 760 px): one line with number, "category · period", title and orgShort.
- `featured` (Home sidebar): number, title, orgShort, expand icon.

**States:**
- default;
- hover: `--glass-hover-fill`, pointer-gated;
- focus-visible: ring;
- active: fill step, no transform.

**Tokens:** `--glass-card-fill` / `--glass-card-grid-fill`, `--glass-card-border`, `--blur-card`, `--radius-card`, `--font-size-numeral`, `--font-size-card-title`.

## TagChip

A non-interactive `li` inside a `ul`, used for dialog tech tags and education honors. Glass chip pill, mono label. Not focusable.

## ProjectDialog (client)

**Base:** native `<dialog>`, `showModal()`, `aria-labelledby` pointing at the title `h2`.

**Anatomy:**
- "NN / 11" position, category pill, period, 44 px close button (`aria-label="Close"`);
- title and org line;
- 17 px summary;
- divider;
- "What I built" with accent-dot bullets;
- tech tags `ul`;
- footer: "Previous project" / "Next project", "View on GitHub" only when a link exists, and "All projects" on Home only.

**Behavior:**
- Open focuses close.
- Escape (`cancel`), ✕ and a backdrop click (`event.target === dialog`) close it, and focus returns to the trigger.
- Previous/Next wrap: all 11 on Projects, the 3 featured on Home.

**Layout:**
- desktop: centered panel;
- mobile: fixed and centered, `width: calc(100% - 20px)`, `max-height: calc(100dvh - 32px)`, its own scroll with `overscroll-behavior: contain`, full-width Previous/Next.
- `html:has(dialog[open])` stops page scroll.

**Tokens:** `--glass-overlay-fill`, `--blur-overlay`, `--glass-modal-fill`, `--glass-modal-border`, `--blur-modal`, `--radius-modal` (28 → 32), `--shadow-modal`, `--font-size-modal-title`, `--color-content-bullet`, `--color-accent`.

**Motion:** per the motion contract. Entry uses `@starting-style`; close is instant.

## ProjectGrid (client)

**Anatomy:** `div role="group" aria-label="Filter projects"` of filter buttons, then cards.

**Filters:** `aria-pressed`, names with counts from data ("All 11", "Work 7", "Independent 2", "Academic 2"), min height 44.

**States:**
- off: `--glass-pill-fill` / `--glass-pill-border`;
- on: `--glass-pill-on-fill` with `--color-content-on-light`;
- hover and focus-visible;
- empty: "No projects in this category".

**Rules:** filtering keeps original numbers. The dialog cycles all projects, and the trigger is stored for focus return.

**Motion:** none on filtering.

## FeaturedProjects (client)

The three featured `ProjectCard`s (`featured` variant) in a `ul`, plus a `ProjectDialog` with the "All projects" link. Position labels use the original number over the total. Renders nothing when no projects are featured.

## RepoList (server)

**Anatomy:** `section` with `h2` "Recently pushed on GitHub" and a "Profile" link, then a `ul` of up to six repo links.

**Repo link:** name plus "{language} · {Mon D}" in UTC; the language is omitted when null. `rel="noopener noreferrer"`.

**Variants:**
- desktop: glass cards (`--radius-card-compact`);
- mobile: one dark-glass list with dividers.

**States:** hover, focus-visible, and empty ("No public repositories yet"). No scrolling.

## Highlights (server)

A `ul` of three dark-glass rows (`--glass-dark-*`, `--blur-dark`), each an `aria-hidden` icon plus text. Renders nothing when empty.

## ToolkitGrid (server)

**Anatomy:** `section` with `h2` "Toolkit" (no subtitle) and a `ul` of four dark-glass cards. Each card has an icon and `h3` area title, four tool lines, and a "Used at …" footer.

**Layout:** `auto-fit` with `minmax(min(var(--size-toolkit-min), 100%), 1fr)`; `--size-toolkit-min` is 150 mobile (2 × 2) and 190 desktop.

## ResumeCard (server)

**Base:** a single `a href="/resume.pdf" download`.

**Anatomy:** "Full résumé", a large "Download" (`--font-size-display`, 44 → 48), and "PDF · {n} KB" computed at build from `public/resume.pdf`.

**Tokens:** feature glass tokens.

**States:** hover and focus-visible.

**Accessibility:** name "Download full résumé (PDF, {n} KB)".

## RoleList (server)

**Variants:**
- desktop cards (`ol`): "{kind} · {location}", title, org, and a right-aligned light start year over a mono range;
- mobile timeline (`ol`): Now → DILG (glowing accent dot) → Theory of Khaos → Adsome → Sieitz → Zenlabs → Education with honor chips.

One variant is hidden per breakpoint. Dots are decorative; "Present" is in text.

## EducationCard (server)

Desktop aside card: degree, school, years, and an honors `ul` of `TagChip` ("TOPCIT Passer 2025", "Dean's Lister AY 2021–22"). On mobile, education lives in the RoleList timeline.

## ContactLine (server)

**Base:** a single link card.

**Anatomy:** label and value, with a 38 px icon ring (`--size-ring`): phone icon for phone, arrow for email, LinkedIn and GitHub.

**Accessibility:** names are "Email lopezpetergabriel@gmail.com", "Call +63 976 126 0783", "LinkedIn profile" and "GitHub profile". External links use `rel="noopener noreferrer"`.

**States:** hover (pointer-gated) and focus-visible.

## Views (server)

`HomeView`, `ProjectsView`, `ExperienceView` and `ContactView` compose each route as section + aside, with exactly one `h1` and no `form`. Column wrappers are plain `div`s so the mobile `display: contents` reorder keeps semantics. Hero chips use `--glass-chip-*` / `--blur-chip`; titles use `--font-size-title` (44 mobile → `clamp(44px, 5.4vw, 76px)`) with `--tracking-title`. CTA pills are 52 px (`--size-cta`): "Email Peter" uses light `--glass-pill-on-fill` and the résumé uses glass `--glass-pill-fill`.
