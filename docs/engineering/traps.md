## Traps

### Theme and rendering

- Do not remove the blocking theme resolver in `app/layout.tsx`. Reading persisted theme after first paint causes a flash.
- Do not broaden the dark media selector to plain `:root`: `:root:not([data-theme="light"])` is required so an explicit light override beats a dark OS preference.
- `localStorage` can throw in blocked/private contexts. The resolver and `ThemeToggle` catch storage failures; theme application must still work for the current page.
- `next dev` can append a Next.js agent-rules block to `AGENTS.md`. `AGENTS.md` and `CLAUDE.md` are generated/project instruction files; restore unrelated generated changes and do not hand-edit them.

### Layout and overflow

- `100vh` tracks the layout viewport, not always the visible mobile viewport. The editor shell and page minimum use `100dvh`; verify document scroll metrics at desktop and mobile sizes.
- The shell has a `40rem` minimum block size. Below that viewport height, the document scrolls as an intentional fallback so header, wrapped tabs, panel content, and `StatusBar` remain reachable; do not hide page overflow to force the frame.

### Content and accessibility

- `docs/design/components.md` describes four project cards and six experience records, while verified preview copy currently supplies two cards and three records. This is an intentional content gap, not permission to invent records.
- jsdom can verify roles, names, ARIA state, and axe output, but not real focus-ring visibility, OS reduced-motion behavior, pre-paint flash, or responsive overflow. Use browser/manual checks for those contracts.
- Flow diagrams need bounded overflow. Let the diagram scroll inside its own viewport; never let the page acquire horizontal overflow.
- A LinkedIn label is intentionally a plain span until a real profile URL exists. Do not turn it into a dead `href`.

### Build, CI, and delivery

- Generated Next types are not guaranteed on a fresh checkout before `npm run typecheck`. `app/layout.tsx` uses explicit `ReactNode` props instead of generated `LayoutProps` so CI typecheck works before `next build`.
- Vercel can silently use the connected repository's default branch for production. Set and verify Production Branch as `main`; keep Node aligned with `.nvmrc`. Vercel is external to this repo and its dashboard is the operational source of truth.
- This machine has multiple GitHub SSH aliases. This repo must use `git@github-personal:...`, not bare `git@github.com:...`, or the wrong SSH identity may be used.
- `public/resume.pdf` is user-supplied. Without it, the status-bar download link cannot satisfy its real-PDF verification gate.
- `.cocoindex_code/`, `node_modules/`, and `.next/` are ignored. Do not stage generated index, dependency, or build artifacts.
