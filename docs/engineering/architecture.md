## Architecture

### Runtime shape

This is a single Next.js App Router route. `app/page.tsx` composes the portfolio from `EditorShell`, `EditorTabBar`, four panel components, and the persistent `StatusBar`. `app/layout.tsx` provides metadata, self-hosted `next/font` Inter/JetBrains Mono variables, global CSS, and the pre-paint theme resolver.

`next build` currently reports `/` as a static prerendered route. The site has no API route, request-body parsing, runtime data fetch, form submission, analytics, or application-created cookie.

### Shell and interaction boundaries

- `components/EditorShell.tsx` owns the viewport-filling frame, theme-toggle header, scrollable content region, and status-bar footer.
- `components/EditorTabBar.tsx` is the client boundary for active-tab state. It renders four fixed-order tabs and all panel slots; inactive panels use `hidden`.
- `components/ThemeToggle.tsx` is the client boundary for theme persistence and root `data-theme` updates.
- `components/TypingHeadline.tsx` is the client boundary for the one-load headline reveal.
- `components/StatusBar.tsx` and `components/AvailabilityBadge.tsx` are server components. `AboutPanel`, `ProjectsPanel`, `ExperiencePanel`, and `ContactPanel` are server components that compose the interactive children where needed.

### Content flow

Typed data lives under `content/`: `types.ts` defines `Project`, `ExperienceEntry`, `FlowStep`, and `ContactLink`; the other modules export about, project, experience, and contact data. Panels map those values into presentation components. Adding a project or experience record is an array change, not a component change.

Projects use `ProjectCard`, `TagChip`, and `FlowDiagram`. Experience uses `ExperienceRecord`. Contact uses `ContactAction`; a missing `ContactLink.href` produces plain LinkedIn placeholder text rather than a dead anchor.

### Styling and delivery

`app/tokens.css` contains primitive and semantic custom properties, including light/dark roles and system-preference fallback. Component styles are CSS Modules and consume semantic tokens. `public/resume.pdf` is served as a static same-origin download. `.github/workflows/ci.yml` runs quality checks for `dev` pushes and `main` pull requests; deployment is external to Actions.
