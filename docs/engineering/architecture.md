## Architecture

### Runtime shape

A Next.js 16 App Router site with four prerendered routes that share the root layout (ADR-0006):

| Route | File | Rendering | View |
|---|---|---|---|
| `/` | `app/page.tsx` | ISR, `revalidate = 86400` | `components/views/HomeView.tsx` |
| `/projects` | `app/projects/page.tsx` | ISR, `revalidate = 86400` | `components/views/ProjectsView.tsx` |
| `/experience` | `app/experience/page.tsx` | static | `components/views/ExperienceView.tsx` |
| `/contact` | `app/contact/page.tsx` | static | `components/views/ContactView.tsx` |

Route files are thin wrappers: they load data on the server and render a synchronous view component. Views are tested directly, because async server pages can't render in React Testing Library. `app/layout.tsx` provides metadata (title template, description, `metadataBase`, `viewport.themeColor`), self-hosted `next/font` Plus Jakarta Sans and Geist Mono, global CSS, and wraps every page in `AppShell`.

There is no API route, form, request-body parsing, analytics or application cookie. Visitors' browsers make no third-party request.

### Shell and client boundaries

- `components/AppShell.tsx` (server): skip link, the frame over the backdrop and scrim, the header ("Portfolio of" / name, desktop résumé/GitHub/email icon links, headshot avatar) and `main#content`.
- `components/SectionNav.tsx` (client, `usePathname`): the desktop icon rail with tooltips and the mobile four-up bar; it sets `aria-current="page"`.
- Client components are limited to:
  - `SectionNav`;
  - `LocalTimeCard` (Manila clock via `useSyncExternalStore`, server placeholder `--:--`);
  - `ProjectGrid` (filters and dialog state);
  - `FeaturedProjects`;
  - `ProjectDialog`.
- `ProjectDialog` is a native `<dialog>` opened with `showModal()`. `useProjectDialog()` holds the open index and the trigger element, and restores focus to the trigger on close.
- `ProjectCard` and `TagChip` have no `'use client'` of their own but are only rendered inside the client components above, so they ship in the client bundle. `icons.tsx` is shared by both sides.
- Everything else is a server component: `ContributionGrid`, `RepoList`, `Highlights`, `ToolkitGrid`, `ResumeCard`, `RoleList`, `EducationCard` and `ContactLine`.

### Content and data flow

- `content/types.ts` defines the contracts. `content/about.ts`, `projects.ts`, `experience.ts` and `contact.ts` hold the CV-backed copy, which traces to the owner's local master CV.
- `content/projects.ts` also exports `projectNumber`/`formatProjectNumber`. They match by `id`, so numbers survive the copies made when server props reach client components.
- **GitHub (ADR-0005).** `lib/github-api.mjs` is the one fetch, validation and normalization module, shared by `scripts/sync-github.mjs` (writes the committed `content/github.ts` fallback) and `lib/github.ts`. `getGithubSnapshot()` runs only in server code:
  - no or blank `GITHUB_TOKEN` → committed snapshot;
  - fetch failure during `next build` (`NEXT_PHASE`) → `console.warn` and the committed snapshot;
  - fetch failure during runtime revalidation → throw, so ISR keeps serving the last good page.
- `lib/contributions.ts` derives the grid's range, totals, active days, busiest day, the last-26-weeks window, month labels and tooltips in UTC.
- **Résumé.** `lib/resume.ts` reads the size of `public/resume.pdf` at build time for the Experience résumé card, and throws if the file is missing. The PDF is generated from `resume/resume.html`.

### Styling

- `app/tokens.css` is the only token file (`docs/design/manifest.json`). It has `/* @primitive */` and `/* @semantic */` layers and is dark-only and mobile-first, with one `@media (min-width: 760px)` override block. A `@supports` fallback switches to darker, opaque glass when `backdrop-filter` is unavailable.
- Component and view CSS Modules use the same 760px breakpoint for desktop layouts.
- Container queries adapt three components to their own width:
  - `ContributionGrid` hides the "’26" suffix below 680px;
  - `ToolkitGrid` goes four across at 796px;
  - `ResumeCard` scales its "Download" text.
- `components/views/View.module.css` holds the shared row/section/aside, hero (chip, title, intro) and CTA styles.
- On mobile, Home, Experience and Contact reorder blocks with `display: contents` on plain `div` wrappers plus `order`. Only non-focusable blocks move.
- `app/globals.css` holds the ground and hatch, the focus ring, `.visually-hidden`, the scroll lock `html:has(dialog[open])` and the reduced-motion kill switch.

### Delivery

`.github/workflows/ci.yml` runs typecheck, lint and test on `dev` pushes and `main` pull requests. Vercel builds and deploys outside Actions. ISR revalidation and the server-only `GITHUB_TOKEN` live in the Vercel project.
