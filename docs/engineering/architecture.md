## Architecture

### Runtime shape

This is a single Next.js App Router route. `app/page.tsx` composes the portfolio from `EditorShell`, `EditorTabBar`, four panel components, and the persistent `StatusBar`. `app/layout.tsx` provides metadata, self-hosted `next/font` Inter/JetBrains Mono variables, global CSS, and the pre-paint theme resolver.

`next build` currently reports `/` as a static prerendered route. The site has no API route, request-body parsing, runtime data fetch, form submission, analytics, or application-created cookie. GitHub data is fetched only by the local sync script and committed as content; visitors make no third-party request.

### Shell and interaction boundaries

- `components/EditorShell.tsx` owns the viewport-filling frame, theme-toggle header, scrollable content region, and status-bar footer.
- `components/EditorTabBar.tsx` is the client boundary for active-tab state. It renders four fixed-order tabs and all panel slots; inactive panels use `hidden`.
- `components/ThemeToggle.tsx` is the client boundary for theme persistence and root `data-theme` updates.
- `components/TypingHeadline.tsx` is the client boundary for the one-load headline reveal.
- `components/StatusBar.tsx` and `components/AvailabilityBadge.tsx` are server components. `AboutPanel`, `ProjectsPanel`, `ExperiencePanel`, and `ContactPanel` are server components that compose the interactive children where needed.

### Content model

Typed data lives under `content/`: `types.ts` defines project, experience, contact, repository, and contribution contracts; the modules export curated content plus the generated `githubSnapshot`. `scripts/sync-github.mjs` fetches public repositories and the contribution calendar with a local token, validates both responses, then writes `content/github.ts` after successful fetches. Panels map those values into presentation components.

Projects use `ProjectCard` and `TagChip`; cards expose their context, copy, technologies, and keyboard focus. `ProjectsPanel` renders project cards beside `RepoList` and `ContributionGrid`, using the committed snapshot and visible sync date. Experience uses `ExperienceRecord`. Contact uses `ContactAction`; a missing `ContactLink.href` produces plain LinkedIn placeholder text rather than a dead anchor.

### Styling and delivery

`app/tokens.css` contains primitive and semantic custom properties, including light/dark roles, contribution levels, wide measure, and system-preference fallback. Component styles are CSS Modules and consume semantic tokens. The active panel owns page scrolling; the ProjectsPanel left-column stack, `RepoList`, and `ContributionGrid` own nested bounded viewports. `public/resume.pdf` is served as a static same-origin download. `.github/workflows/ci.yml` runs quality checks for `dev` pushes and `main` pull requests; deployment is external to Actions.
