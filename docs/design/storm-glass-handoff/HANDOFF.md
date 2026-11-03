# Storm Glass redesign — implementation handoff

**For:** Claude Code, working in `lopezpetergabriel-portfolio` (branch `dev`)
**From:** the Claude Design canvas "Portfolio Redesign — Storm Glass" (exported Nov 3, 2026)
**Owner:** Peter Gabriel Lopez

This replaces the current code-editor portfolio (four tabs: `about.md` / `projects.tsx` / `experience.json` / `contact.md`) with a frosted-glass dashboard over a dark storm-teal photo backdrop. The visual reference is `reference/inspiration.jpg`. The content source is `reference/Peter_Gabriel_Lopez_Master_CV.md`.

Read this file first, then the design files for exact values.

---

## 1. What's in this zip

| Path | What it is |
|---|---|
| `HANDOFF.md` | This document |
| `design/canvas.json` | Artboard index: name, size and position of each screen |
| `design/Main.dc.html` | Home, desktop (1440 wide, fluid page) |
| `design/Projects.dc.html` | Projects, desktop, with filters and the project modal |
| `design/Experience.dc.html` | Experience, desktop, with the toolkit |
| `design/Contact.dc.html` | Contact, desktop |
| `design/Mobile-*.dc.html` | The same four screens at 390 wide |
| `reference/inspiration.jpg` | Mood reference Peter supplied (a weather dashboard) |
| `reference/Peter_Gabriel_Lopez_Master_CV.md` | Authoritative content source, including what not to claim |

### How to read the `.dc.html` files

They are Claude Design components and **will not render on their own**. They need the canvas runtime (`support.js`). Treat them as the spec:

- **Inline `style="…"` attributes** are the exact visual values: sizes, colors, radii, blur, gaps. Copy them into tokens and CSS Modules; don't eyeball them.
- **`{{hole}}`** is a value computed in the script at the bottom of the file.
- **`<sc-for list="{{x}}" as="y">`** is a loop and **`<sc-if value="{{x}}">`** is a conditional.
- **The `<script type="text/x-dc">` block** (`class Component extends DCLogic`) holds the data and behavior: project records, the contribution-grid math, modal state, filters and the clock.
- **`<a href="Projects.dc.html">`** links are navigation between screens. In the app these become routes.
- **"Backdrop photo · 2400 × 1600" and "Photo" circles** are placeholders. The backdrop itself is a gradient-and-hatch stand-in for a real photo.

---

## 2. Decisions that break current repo rules

Several rules in `docs/engineering/invariants.md` and ADRs 0004/0005 describe the old editor UI. **Write `docs/engineering/decisions/ADR-0006-storm-glass-dashboard.md`** (use `ADR-template.md`). Mark ADR-0004 superseded and amend ADR-0005. Then update `invariants.md`, `conventions.md`, `architecture.md`, `traps.md`, `docs/design/README.md` and `docs/design/components.md` in the same change.

| Current rule | New behavior |
|---|---|
| Four tabs in a fixed order with `tablist`/`tab`/`tabpanel` ARIA and roving tabindex | Four **sections**: About (Home), Projects, Experience, Contact. Navigation is real links with `aria-current="page"`. **Recommended:** static App Router routes `/`, `/projects`, `/experience`, `/contact`, all prerendered, sharing one layout. This keeps the "static App Router site" rule. |
| ADR-0004: frame locked to `100dvh`, panels own scrolling, three nested scroll owners | The page scrolls normally. The frame has `min-height: 100dvh` and grows with content. **No nested scroll areas**; the contribution grid fits the width instead of scrolling sideways. |
| `StatusBar`, `TypingHeadline` and the editor chrome | Removed. Availability now appears in the local-time card and on the Contact chip. |
| Light/dark themes with a persisted toggle and a pre-paint resolver | The design is **dark only**; there is no light variant and no toggle. See open decision #1. If Peter confirms dark-only, remove `ThemeToggle`, the theme script in `app/layout.tsx` and the light/dark token blocks, and record it in the ADR. |
| Fonts: Inter and JetBrains Mono | **Plus Jakarta Sans** (300–700) and **Geist Mono** (400–500), self-hosted via `next/font/google`. This keeps the "no third-party runtime request" rule. |
| Exactly 5 projects and 3 experience records | **11 projects**, **5 roles**, **1 education record** (with honors), plus a toolkit and three DILG highlights. Keep the source-backed rule: everything comes from the CV. |
| LinkedIn has no URL and renders as a plain span | LinkedIn **has a URL**; render it as a link. |
| No phone number | **Phone added** at Peter's request: `+63 976 126 0783`, as a `tel:+639761260783` link on Contact. |
| Contribution grid lives on Projects in a scrolling box | It moves to **Home**: the full year on desktop and the last 26 weeks on mobile. The repo list moves to the Projects sidebar (6 rows, no scrolling). |

Unchanged rules: static prerendered pages; no forms, analytics, cookies or runtime GitHub fetches (the grid still reads the committed `content/github.ts` snapshot); `/resume.pdf` as a real download; Node 22; CI gates; `rel="noopener noreferrer"` on external links; reduced-motion support; visible focus rings.

---

## 3. Design tokens

Put primitives and semantic roles in `app/tokens.css` (ADR-0002). Every value below appears inline in the design files.

### Color

| Role | Value | Used for |
|---|---|---|
| `page-ground` | `#1b2a2c` | `body` and the outer margin around the frame (with a faint 135° hatch `rgba(255,255,255,.025)` every 16px) |
| `frame-placeholder` | base `#33494c`; vertical gradient `#4a6266 → #34494c → #2b3d36 → #22322a` | Stand-in for the photo. Delete once the real photo ships. |
| `scrim-desktop` | `linear-gradient(90deg, rgba(10,20,22,.5), rgba(10,20,22,.08) 58%, rgba(10,20,22,.3))` | Over the photo, so left-side text stays legible. **Keep it with the real photo.** |
| `scrim-mobile` | `linear-gradient(180deg, rgba(10,20,22,.45), rgba(10,20,22,.15) 40%, rgba(10,20,22,.35))` | Same, on mobile |
| `content-primary` | `#F3F6F5` | Default text and icons |
| `content-strong` | `#FFFFFF` | Active nav item, selected states |
| `content-body` | `#E4EBEA` | Paragraphs on the photo or on glass |
| `content-meta` | `#DCE4E3` | Labels, dates, mono captions |
| `content-bullet` | `#EEF2F1` | Modal bullet text |
| `ink-on-light` | `#14211f` | Text on light pills (Email Peter, selected filter, GitHub link in the modal) |
| `accent-glow` | `#F5E3A8`; glow `rgba(245,227,168,.55–.65)` | Availability dot, modal bullets, top contribution level. Use it sparingly. |
| `focus-ring` | `2px solid #F5E3A8`, `outline-offset: 3px` | All `:focus-visible` |

### Glass surfaces (fill / border / backdrop-filter)

Always pair `backdrop-filter` with `-webkit-backdrop-filter`.

| Surface | Fill | Border | Blur | Extra |
|---|---|---|---|---|
| Nav rail / mobile nav | `rgba(255,255,255,.12)` | `rgba(255,255,255,.18)` | `blur(20px) saturate(140%)` | radius 24 / 22 |
| Active nav item | `rgba(255,255,255,.26)` | none | none | text `#fff`, radius 16 |
| Card (project, role, repo, contact line) | `.14` (project grid cards `.13`) | `.20` | `blur(20px) saturate(140%)` | radius 22 (role cards and repos 20) |
| Feature card (local time, résumé) | `.16` | `.26` | `blur(24px) saturate(150%)` | radius 26 (24 on mobile); shadow `0 12px 40px rgba(6,14,15,.22)` |
| Dark glass (toolkit, DILG highlights, "write about", mobile repo list) | `rgba(10,20,22,.28–.30)` | `rgba(255,255,255,.14–.16)` | `blur(16–18px)` | radius 18–22 |
| Chip (hero tag) | `rgba(255,255,255,.16)` | `.20` | `blur(12px)` | pill |
| Icon button (header) | `.14` | `.20` | `blur(16px)` | 46px circle |
| Filter pill | off: `rgba(255,255,255,.10)` with `.26` border; on: `#F3F6F5` fill, `#14211f` text | | | 44px min height |
| Modal overlay | `rgba(8,16,18,.58)` | | `blur(8px)` | |
| Modal panel | `rgba(34,52,55,.82)` (`.86` on mobile) | `.24` | `blur(32px) saturate(150%)` | radius 32 (28 on mobile); shadow `0 40px 120px rgba(4,10,11,.6)` |
| Frame | photo plus scrim | | | radius 36, `overflow: hidden`, shadow `0 30px 80px rgba(5,12,13,.45)` |

### Contribution levels (GitHub `level` 0–4)

| Level | Fill |
|---|---|
| 0 | `rgba(255,255,255,.07)` |
| 1 | `rgba(214,226,224,.30)` |
| 2 | `rgba(228,236,234,.56)` |
| 3 | `rgba(243,246,245,.88)` |
| 4 | `#F5E3A8` plus `box-shadow: 0 0 8px 1px rgba(245,227,168,.65)` |

The levels get lighter step by step, so they read without color.

### Type

| Use | Font | Size / line height | Weight | Tracking |
|---|---|---|---|---|
| Page title (h1) | Plus Jakarta Sans | `clamp(44px, 5.4vw, 76px)` / 1.04 (mobile 44 / 1.05) | 400 | -0.03em |
| Clock | Plus Jakarta Sans | 76 desktop, 64 mobile / 1 | 400 | -0.045em |
| "Download" on the résumé card | Plus Jakarta Sans | 48 desktop, 44 mobile | 400 | -0.04em |
| Modal title (h2) | Plus Jakarta Sans | `clamp(28px, 3.4vw, 40px)` / 1.1 (mobile 28) | 500 | -0.025em |
| Big numerals (01, 2026, …) | Plus Jakarta Sans | 26–34 | 300 | -0.04em |
| Card title | Plus Jakarta Sans | 15–18 / 1.3 | 600 | -0.01em |
| Body | Plus Jakarta Sans | 15 / 1.65; modal summary 17 / 1.6; modal bullets 15 / 1.6 (mobile 14) | 400 | |
| Labels and captions | Geist Mono | 10–12 | 400 | |
| Name in header | Plus Jakarta Sans | 17 (mobile 16) | 600 | -0.01em |

### Shape, spacing, motion

- **Radii:** frame 36; modal 32; feature cards 26; nav rail 24; cards 22; role cards 20; nav items 16; filter and tag pills 999; contribution cells 3 (2 on mobile).
- **Spacing:** page padding `clamp(12px, 2.8vw, 40px)`; frame padding 22; nav-to-content and section-to-sidebar gap 28; sidebar stack gap 10–12; card grids gap 12; card padding 16×18, 18 or 20×22.
- **Motion:**
  - Modal overlay: fade 200ms ease-out.
  - Modal panel: expands over 340ms (320ms on mobile) `cubic-bezier(.2,.8,.2,1)`, from `opacity 0; translateY(18px) scale(.94)`.
  - `prefers-reduced-motion: reduce` turns off all animation and transitions.
- **Icons:** inline SVG, 24×24 viewBox, `stroke="currentColor"`, stroke width 1.6–1.8, round caps and joins. Copy the paths from the design files into small icon components rather than adding an icon library (the repo avoids dependencies). There is no GitHub logo: GitHub uses a generic branch icon.
- **Contrast:** colors were chosen against the dark placeholder. Re-check text at 4.5:1 once the real photo and scrim are in, especially the 11–12px `#DCE4E3` captions on cards.

---

## 4. Layout

### Desktop shell (all four sections)

```
body (#1b2a2c, padding clamp(12px,2.8vw,40px))
└─ frame (max-width 1360, centered, radius 36, photo + scrim, padding 22, flex-wrap, gap 28)
   ├─ nav rail (flex: 1 1 64px; full height; grid of 48px items)
   │    PL logo (48 circle, #F3F6F5 fill) → About · Projects · Experience · Contact (48×48, r16) → Résumé download (bordered)
   └─ main column (flex: 999 1 560px; column; gap 28)
        ├─ header: "Portfolio of" / "Peter Gabriel Lopez"  ·····  [Résumé] [GitHub] [Email] icon buttons (46) + avatar (52)
        └─ content row (flex-wrap, gap 28)
             ├─ section (flex: 999 1 520px): chip → h1 → body → … feature block at the bottom (space-between)
             └─ aside (flex: 1 1 300px): stacked glass cards → backdrop-placeholder label at the bottom
```

### Mobile (390)

Header row (PL logo with name; avatar on the right), then a **4-up labeled nav** (glass, 56px items: icon over an 11px label, active item filled), then the content stacked in one column with 20px gaps. The structure differs from desktop (labeled nav, header without icon buttons), so **use one width breakpoint around 760px** for the shell. Note this in ADR-0006, because conventions currently prefer `auto-fit` over media queries. Inside sections, keep using `auto-fit` grids.

### Screen by screen

**Home** (`Main`, `Mobile-Home`)

- Section:
  - Chip "Software Engineer & Automation Specialist"
  - h1 "Useful systems / over noisy demos." (line break after "systems" on desktop)
  - Body paragraph (§6)
  - **Contribution grid** at the bottom (§5.3)
- Sidebar:
  - **Local time card** (§5.4)
  - "Selected work" label with a link to "All 11 projects"
  - **Three project buttons** (01 DILG platform, 02 pi-extensions, 03 Client Intake & CRM Migration). Each opens the project modal.
  - Backdrop-placeholder label at the bottom
- Mobile: the order is hero, CTA pills ("Email Peter" plus "Résumé"), time card, grid (last 26 weeks), selected work.

**Projects**

- Section:
  - Chip "Projects · 11 builds"
  - h1 "What I've built"
  - Intro: "Government systems, client automations, generative-media pipelines and AI-agent infrastructure. Select a project for the full breakdown." (mobile says "Tap")
  - **Filter pills**: All 11 · Work 7 · Independent 2 · Academic 2
  - **Card grid**: `repeat(auto-fit, minmax(min(260px,100%),1fr))`, gap 12. Each card is a `<button>` with min-height 250 containing:
    - number and category pill
    - title
    - "org · period"
    - summary clamped to 3 lines
    - first three tags, plus an expand icon
- Sidebar: "Recently pushed on GitHub" with a Profile link, and **6 repo cards** from `githubSnapshot.repos`, each showing name and "language · Mon D". The design omits the language when it is null (hearth).
- Mobile: compact one-line cards (number, "category · period", title, short org, expand icon). The repos sit in one dark-glass list with dividers.

**Experience**

- Section:
  - Chip "Experience · Currently"
  - h1 "Data Analyst / at DILG Region VI"
  - Body (§6)
  - **Three DILG highlight rows** (dark glass, icon plus text)
  - **Toolkit**: an h2 "Toolkit" over four dark-glass cards in `auto-fit minmax(min(190px,100%),1fr)`. Each card has an icon and title, four tool lines, and a "Used at …" footer. **Note:** Peter deleted the toolkit subtitle on desktop. Mobile still says "By area, with where I've used it"; confirm whether to drop it there too.
- Sidebar:
  - **Résumé card**: "Full résumé" / big "Download" / "PDF · 116 KB". Compute the size from `public/resume.pdf` at build time; don't hardcode it.
  - "Roles" label and **5 role cards**: "kind · location", title, org, and a right-aligned start year (big, light) over a mono range.
  - "Education" label and an **education card** with honor chips.
- Mobile:
  - Hero and highlights
  - **Vertical timeline**: Now → DILG (glowing dot) → Theory of Khaos → Adsome → Sieitz → Zenlabs → Education with chips
  - Toolkit as a 2×2 grid
  - Résumé card

**Contact**

- Section:
  - Chip with an accent dot, "Available for contract work"
  - h1 "Open a / conversation"
  - Body "No contact form. Send a direct note about an automation, backend, or AI-agent build."
  - **CTAs**: "Email Peter" (light pill, 52px) and "Download résumé" (glass pill)
  - "Good things to write about": 3 dark-glass cards (Automation, Backend, AI agents)
- Sidebar:
  - **Local time card** with the languages line "English · Filipino · Hiligaynon"
  - "Direct lines" label and 4 link cards: Email, Phone, LinkedIn, GitHub, each with an arrow or phone icon in a 38px ring

---

## 5. Interactive pieces

### 5.1 Project modal (`ProjectDialog`, client)

- **Opened from:** Projects cards (all 11) and the Home "Selected work" buttons (the 3 featured).
- **Use native `<dialog>` with `showModal()`.** The design uses a `div[role=dialog]` only because of canvas limits. Native gives focus containment, an inert background and Escape for free. Label it with `aria-labelledby` pointing at the title.
- **Content, top to bottom:**
  - "01 / 11", a category pill, the period, and a close button (44px circle, `aria-label="Close"`)
  - Title (h2) and org line
  - Summary (17px)
  - Divider
  - "What I built" (mono label) with a bulleted `points[]` list (6px accent dots)
  - Tech tags (`<ul>` of non-interactive `<li>` chips, matching the current `TagChip` rule)
  - Footer: "Previous" / "Next" buttons and, if `link` exists, a light "View on GitHub" pill. On Home, the footer also has an "All projects" link.
- **Behavior:**
  - On open, focus the close button.
  - Escape, ✕ and a backdrop click all close it.
  - On close, return focus to the card that opened it.
  - Previous/Next cycle through all 11 on Projects and through the 3 featured on Home.
  - The open animation is §3's "expand"; reduced motion turns it off.
- **Mobile:** in the design the panel opens next to the tapped card, which was a canvas workaround. In the app, make it a fixed, viewport-centered dialog with `width: calc(100% - 20px)`, `max-height: calc(100dvh - 32px)` and its own scroll. The full-width Previous/Next pills sit at the bottom.

### 5.2 Project filters

`role="group" aria-label="Filter projects"`, made of buttons with `aria-pressed` and a count. Filtering keeps each card's original number (01–11).

### 5.3 Contribution grid (`ContributionGrid`, can stay a server component)

- **Data:** read `githubSnapshot.contributions.weeks` (53 weeks × 7 days, Sunday first, with `count` and `level`). **Don't hardcode the arrays.** The design hardcoded them only because the canvas has no data import.
- **Desktop, full year:**
  - Layout: a 26px day-label column (Mon/Wed/Fri), then cells in `grid-auto-flow: column; grid-template-rows: repeat(7, auto); grid-auto-columns: minmax(0,1fr); gap: 3px`, each cell `aspect-ratio: 1`. The cells fill the width, so nothing scrolls sideways.
  - Month labels: a 53-column grid above. Label a week when its Sunday falls in a new month, spanning 3 columns. If two labels would sit fewer than 3 columns apart, drop the earlier one when it's the first label. Show January as "Jan ’26".
  - Caption: "GitHub contributions · Sep 14, 2025 – Sep 19, 2026" on the left; "901 in the past year · 137 active days" on the right.
  - Footer: "Busiest day: 47 on Sep 7, 2026" plus a Less → More legend of 5 swatches.
- **Mobile:** the last 26 weeks only, 2px gaps, no day labels. Caption: "GitHub contributions · last 26 weeks" / "706 since Mar 22, 2026 · 901 in the past year".
- **Accessibility:** cells and legend are `aria-hidden` (as today) with `title` tooltips like "6 contributions on Sep 8, 2026". The totals live in a `<figcaption>`.
- **Dates:** keep the existing "absolute UTC dates" rule (format in UTC).

### 5.4 Local time card (`LocalTimeCard`, client)

- **Display:** a pin icon with "Iloilo City, Philippines"; a big `HH:mm` (24-hour, `Asia/Manila`) beside a small "UTC+8"; then "{Weekday} · Peter's local time".
- **Second line:** Home shows "● Available · Contract · Across timezones"; Contact shows "English · Filipino · Hiligaynon".
- **Timing:** render a stable placeholder (`--:--`) on the server and set the real time in `useEffect` to avoid a hydration mismatch. Refresh every 15s and clear the interval on unmount.

### 5.5 Navigation

- **Desktop rail:** icon-only links with `aria-label` and `title`. Add visible tooltips on hover and focus for clarity.
- **Mobile:** icon-and-label links.
- **Active item:** `aria-current="page"`, set from `usePathname()` in a small client `SectionNav`. Everything else can stay server-rendered.

---

## 6. Content changes (source: `reference/Peter_Gabriel_Lopez_Master_CV.md`)

Exact copy lives in the design files. Where to find it:

| Content | Where to copy it from |
|---|---|
| 11 project records (category, title, org, period, summary, points, tags, optional link) | `design/Projects.dc.html` → `projects()` in the script. Mobile adds `orgShort`. |
| Home featured projects | The first 3 records (`design/Main.dc.html` → `featuredProjects()`) |
| Home chip, headline and body | `design/Main.dc.html` markup |
| Roles, education and DILG highlights | `design/Experience.dc.html` markup (mobile timeline wording is in `Mobile-Experience`) |
| Toolkit (4 areas × 4 lines plus "Used at") | `design/Experience.dc.html` markup |
| Contact lines, languages and "write about" cards | `design/Contact.dc.html` markup |

### Suggested content model (`content/types.ts`)

```ts
type ProjectCategory = "Work" | "Independent" | "Academic";
interface Project {
  id: string;                 // stable slug, e.g. "dilg-data-warehouse"
  category: ProjectCategory;
  title: string;
  org: string;                // shown in the modal, e.g. "DILG Region VI · Data Analyst"
  orgShort: string;           // shown on cards
  period: string;             // "Jun 2026 – Present"
  summary: string;
  points: readonly string[];
  tags: readonly string[];
  link?: { href: string; label: string };
  featured?: boolean;         // the first three
}
interface Role {
  title: string; org: string;
  kind: "Full-time" | "Freelance" | "Part-time" | "Internship";
  location: string;           // "Iloilo City" | "Remote, UK" | "Remote, Sweden"
  start: string; end?: string; // display strings; end absent = Present
}
interface Education { degree: string; school: string; years: string; honors: readonly string[] }
interface ToolkitArea { area: "Backend" | "Automation" | "AI agents" | "Media"; items: readonly string[]; usedAt: string }
interface ContactLink { label: string; value: string; href?: string } // add phone and LinkedIn hrefs
```

### Facts to keep exact (all from the CV)

- **Roles:**
  - DILG Region VI, Data Analyst, Jun 2026–Present, full-time
  - Theory of Khaos, Freelance Automation Consultant, Jan–Jun 2026, remote (UK)
  - Adsome (Stromberg Media AB), Lead Automation Specialist, part-time, Jan–Mar 2026, remote (Sweden)
  - Sieitz Innovations OPC, Multimedia Specialist & AI Automation Lead, Aug 2025–May 2026
  - Zenlabs Venture Management Inc., Automation Engineer & CRM Intern, Jan–May 2025
- **Education:** BS Computer Science, Iloilo Science and Technology University, 2021–2025, with TOPCIT Passer 2025 and Dean's Lister AY 2021–22.
- **Wording rules from the CV:**
  - The Theory of Khaos intake is **Make.com**; its AI research workflow is **n8n**.
  - Sieitz's **Dockerized Go AI content platform is separate** from the static site deployed on Vercel.
  - Describe the DILG platform as in development, not deployed.
- **Left out on purpose:** the 70% editing-time figure (needs Peter's confirmation), the Dog Breed accuracy figure, and high-school honors. Don't add metrics.
- **Contact:**
  - lopezpetergabriel@gmail.com
  - `+63 976 126 0783`
  - https://www.linkedin.com/in/peter-gabriel-lopez-702646393
  - https://github.com/petergabriel-dev
- **Also fix:** `app/layout.tsx` metadata still says "Create Next App". Set a real title and description, for example "Peter Gabriel Lopez — Software Engineer & Automation Specialist".

---

## 7. Component plan (maps to the current `components/`)

| New or changed | Replaces | Client? |
|---|---|---|
| `AppShell` (backdrop, frame, rail or mobile header, header actions) via `app/layout.tsx` or a route group layout | `EditorShell` | no |
| `SectionNav` | `EditorTabBar` | yes (pathname) |
| `LocalTimeCard` | `AvailabilityBadge`, `StatusBar` | yes |
| `ContributionGrid` (restyled, `weeks` prop) | existing | no |
| `ProjectGrid` (filters, cards, dialog state), `ProjectCard` (button), `ProjectDialog` | `ProjectsPanel` / `ProjectCard` | yes |
| `FeaturedProjects` (Home sidebar, reuses `ProjectDialog`) | none | yes |
| `RepoList` (6 rows, no scrolling) | existing | no |
| `RoleCard`, `EducationCard`, `ToolkitGrid`, `Highlights` | `ExperienceRecord` | no |
| `ContactLine` (link card with icon ring) | `ContactAction` | no |
| `TagChip` (keep as a non-interactive `li`) | existing | no |
| Icons (`components/icons/*.tsx`, inline SVG) | none | no |

Remove `TypingHeadline` and `StatusBar`. Remove `ThemeToggle` and the theme resolver only if decision #1 is dark-only.

---

## 8. Assets still needed (placeholders in the design)

1. **Backdrop photo:** landscape about 2400×1600 for desktop, plus a portrait crop about 1200×2400 for mobile. Darker sky top-left reads best, as in the reference. Serve it locally from `public/` (no remote host) with `next/image` or a CSS background. Keep the scrim. Delete the "Backdrop photo" labels once it's in.
2. **Profile photo** for the avatar: 52px circle on desktop, 44px on mobile, with a 2px `rgba(255,255,255,.75)` ring.
3. **`public/resume.pdf`:** the current file is dated Sep 20. Replace it with a version that matches the CV.

---

## 9. Open decisions for Peter (ask before building these parts)

1. **Theme:** dark-only as designed (recommended), or keep a light variant? This decides whether `ThemeToggle` and the pre-paint resolver stay.
2. **Routing:** separate static routes (recommended; matches the design's links and gives shareable URLs) or one page with client-side section switching?
3. **Availability:** is "Available for contract work" still true alongside the full-time DILG role? It appears on Home, Experience (mobile "Now" row) and Contact.
4. **Toolkit, Media card:** Premiere Pro, DaVinci Resolve, Lightroom, Photoshop and Capture One come from the CV's tool inventory, not a specific project. Keep or trim?
5. **Toolkit subtitle:** removed on desktop. Remove "By area, with where I've used it" on mobile too?

---

## 10. Suggested order and checks

1. ADR-0006 plus doc updates (§2), so the rules match the new design before code changes.
2. Tokens in `app/tokens.css` and fonts in `app/layout.tsx` (§3).
3. Content model and data (§6).
4. Shell, nav and routes (§4, §5.5).
5. Screens: Home, Projects, Experience, Contact.
6. Interactive pieces: dialog, filters, grid, clock (§5).
7. **Tests** (`tests/accessibility.test.tsx`):
   - Replace the tab tests with nav `aria-current` tests per route.
   - Dialog: opens from a card, focuses close, Escape closes, focus returns to the trigger, Previous/Next work.
   - Filter `aria-pressed` state and counts.
   - Phone `tel:` and LinkedIn links exist.
   - The grid's figcaption totals come from the snapshot.
   - axe scans on every route.
8. Run `npm run typecheck && npm run lint && npm test && npm run build`.
9. Browser checks (jsdom can't do these):
   - 1440 and 390 widths with no horizontal overflow
   - The backdrop-filter look in Safari (needs `-webkit-`)
   - Keyboard path through the modal
   - Reduced motion
   - Contrast over the real photo

Work on `dev`. Releases go through a `dev` → `main` pull request, as described in `docs/engineering/dev-workflow.md`.
