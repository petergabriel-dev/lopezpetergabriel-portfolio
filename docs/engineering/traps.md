## Traps

### Data and ISR

- `getGithubSnapshot()` must **throw** on a runtime fetch failure. Returning the committed snapshot instead would make ISR cache old data as a fresh page; a throw keeps the last good page.
- The build-time fallback depends on `process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD`, which `next build` sets before it spawns the static workers. Outside the build, a failure throws.
- ISR isn't observable in `next dev`. Check `next build` output, `x-nextjs-cache` headers from `npm run start`, and preview deployments.
- An expired or revoked `GITHUB_TOKEN` doesn't break anything visibly: runtime revalidation keeps serving the last good page indefinitely. Watch Vercel logs and rotate the token before it expires.
- Props passed from a server component to a client component arrive as **copies**. `array.indexOf(obj)` against a module-level array returns −1 in the browser (cards once all showed "00"). Match by `id`.
- `/experience` reads `public/resume.pdf` at build time. A missing file fails the build on purpose.

### Rendering and CSS

- Only set `display` on `dialog[open]`. Author styles beat the browser's built-in `dialog:not([open]) { display: none }`, so a bare `.dialog { display: flex }` would show a closed dialog.
- Mobile `order` on `display: contents` children leaks into desktop when the wrapper becomes a flex container. Reset `order: 0` in the desktop media query.
- When a view class toggles a component's root `display` (for example `.desktopOnly`), use a two-class selector (`.side .desktopOnly`). CSS Module load order is not guaranteed.
- Don't name a modifier class after a variant key that is applied through `styles[variant]` (`.year` matched both the "year" grid variant and the suffix).
- Use `display: contents` only on plain `div` wrappers, never on `section`, `aside` or lists, because it can drop their semantics.
- Hide rail-only nav items after the base `.link` rule. Equal-specificity rules declared earlier lose.
- Always pair `backdrop-filter` with `-webkit-backdrop-filter`.
- The dialog entry uses `@starting-style`. Browsers without it open the dialog instantly, which is acceptable.
- A button may only hold phrasing content, so card tags are one text line, not a list.
- Accessible names join adjacent spans without spaces ("Work7"). Put a literal `{" "}` between spans.
- Long emails break mid-word under `overflow-wrap: anywhere`. Use `<wbr>` before "@" with `overflow-wrap: break-word`.
- `next dev` can append a Next.js agent-rules block to `AGENTS.md`. `AGENTS.md` and `CLAUDE.md` are generated or project instruction files; restore unrelated generated changes and don't hand-edit them.

### Tests (jsdom)

- jsdom has no `HTMLDialogElement.showModal`/`close`, so `vitest.setup.ts` stubs them. Simulate Escape by dispatching a cancelable `cancel` event and then calling `close()`, as browsers do.
- jsdom applies base CSS-Module rules but not `@media (min-width: 760px)`, so tests see the mobile layout. Desktop-only elements are `display: none` there and their text-based accessible names compute as empty. Query them by selector, or test the mobile equivalent.
- When parallel requests share one mocked `Response`, the second read fails ("Body is unusable"). Return a new `Response` per call.
- `usePathname` needs `vi.mock("next/navigation")`.
- jsdom can't verify focus-ring visibility, reduced motion, `backdrop-filter`, contrast or overflow. Use browser QA.

### Content

- Every record must trace to the master CV, which is kept local and gitignored under `docs/design/storm-glass-handoff/reference/`. The 70% editing-time figure, the Dog Breed accuracy figure and high-school honors stay out.
- The contrast table in `docs/design/README.md` assumes the stand-in backdrop. Measure again when a real photo replaces it.

### Build, CI and delivery

- Generated Next types aren't guaranteed on a fresh checkout before `npm run typecheck`. `app/layout.tsx` uses explicit `ReactNode` props instead of generated `LayoutProps`. After deleting a route, run `next build` before typecheck, or stale `.next/types` fail with TS2307.
- Vercel can silently use the connected repository's default branch for production. Set Production Branch to `main` and verify it, and keep Node aligned with `.nvmrc`.
- This machine has several GitHub SSH aliases. This repo must use `git@github-personal:...`, not bare `git@github.com:...`, or the wrong identity may be used.
- `.cocoindex_code/`, `node_modules/`, `.next/` and `.playwright-cli/` must not be staged.
