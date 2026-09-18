## Invariants

- The site remains a static Next.js App Router page. `next.config.ts` does not set `output: 'export'` or `ignoreBuildErrors`; production builds must typecheck.
- Node major is 22 as pinned by `.nvmrc`; CI reads the same file.
- The four tabs stay in order: `about.md`, `projects.tsx`, `experience.json`, `contact.md`. The active tab has `aria-selected="true"` and `tabIndex=0`; inactive tabs have `tabIndex=-1`. Arrow navigation wraps and moves focus.
- Every tab's `aria-controls` resolves to its live `tabpanel`; inactive panels are hidden. Focus indicators use `--color-border-focus` with offset and are not color-only.
- `prefers-reduced-motion: reduce` disables typing, cursor blink, panel motion, and project-card lift. Availability always has visible text; color/pulse is supplemental.
- Theme resolution runs before application content: stored `portfolio-theme` values `light`/`dark` win, otherwise OS dark preference sets `data-theme="dark"`. Storage failures must fall back to OS preference without breaking rendering. The dark media rule is scoped to `:root:not([data-theme="light"])` so explicit light wins on dark OS settings.
- Content is source-backed. Current shipped data contains exactly two project records and three experience records from `docs/design/preview.html`; missing future entries must shorten output rather than crash. LinkedIn has no URL and must not render as a link.
- `FlowDiagram` provides a text alternative naming every step. `TagChip` remains a noninteractive list item. GitHub links use `rel="noopener noreferrer"`; the resume is a real `/resume.pdf` download anchor.
- No contact form, request body, analytics, third-party runtime script, application-created cookie, or repository secret is part of the app.
- CI must run `npm ci`, typecheck, lint, and test on `dev` pushes and `main` pull requests. Main protection requires the `quality` check.
