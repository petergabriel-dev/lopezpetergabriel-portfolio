## Invariants

- The site is a Next.js App Router app with four prerendered routes: `/`, `/projects`, `/experience` and `/contact`. `/` and `/projects` use ISR with `export const revalidate = 86400`; `/experience` and `/contact` are fully static. No route renders per request. `next.config.ts` does not set `output: 'export'` or `ignoreBuildErrors`; production builds must typecheck.
- Node major is 22 as pinned by `.nvmrc`; CI reads the same file.
- One labelled `nav` holds real links in a fixed order: About (`/`), Projects, Experience, Contact. The current route's link has `aria-current="page"`. There is no `tablist` and no client-side section switching.
- The page scrolls normally. The frame has a `100dvh` minimum and grows with content. There are no nested scroll areas, and no route has horizontal page overflow at 320 px wide or more.
- The site is dark only. There is no theme toggle, persisted theme value or pre-paint theme script.
- Every `:focus-visible` element shows a 2 px solid accent outline with a 3 px offset. Interactive controls have targets of at least 44 × 44 px.
- `prefers-reduced-motion: reduce` removes all transitions and animations. Availability is always stated in text; the accent dot is supplemental.
- Content is source-backed by `docs/design/storm-glass-handoff/reference/Peter_Gabriel_Lopez_Master_CV.md`. Do not invent facts, metrics, links or records. Missing entries shorten output rather than crash. The 70% editing-time figure, the Dog Breed accuracy figure and high-school honors stay out unless the owner confirms them.
- GitHub data is fetched only server-side. `GITHUB_TOKEN` is server-only: never `NEXT_PUBLIC_`, and never in the repository, CI, generated content, logs, error messages or the client bundle. With no token, the committed `content/github.ts` snapshot is used. A build-phase fetch failure falls back to that snapshot. A runtime revalidation failure throws, so ISR keeps the last good page. Visitors' browsers never request GitHub. Dates render as absolute UTC text.
- LinkedIn and phone render as links (phone uses `tel:`). External links use `rel="noopener noreferrer"`. `TagChip` remains a noninteractive list item. The résumé is a real `/resume.pdf` download anchor.
- Project details open in a native `<dialog>` via `showModal()`, labelled by its title. Opening focuses the close button. Escape, the close button and a backdrop click all close it, and focus returns to the trigger.
- No contact form, request body, analytics, third-party runtime script, application-created cookie or repository secret ships in the app or CI. A gitignored `.env.local` token is permitted for local sync and builds; the deployment token lives only in Vercel environment variables.
- CI must run `npm ci`, typecheck, lint and test on `dev` pushes and `main` pull requests. Main protection requires the `quality` check.
