## Conventions

### TypeScript and components

Use strict TypeScript with the `@/*` project alias from `tsconfig.json`. Keep reusable content contracts in `content/types.ts`; export content as typed readonly arrays or readonly data objects. Prefer semantic HTML and named component exports. Keep client boundaries narrow: add `'use client'` only for browser state, effects, or keyboard interaction (`EditorTabBar`, `ThemeToggle`, `TypingHeadline`).

Components receive content through props or content modules. Do not fabricate copy, metrics, screenshots, project outcomes, role records, or URLs. A missing external URL is represented by an absent `ContactLink.href`, not a placeholder anchor. Generated `content/github.ts` is committed, typed content; the app never fetches GitHub at runtime.

### CSS

Use one CSS Module beside each component or panel. Consume semantic variables such as `--color-content-primary`, `--space-*`, `--font-family-*`, and motion tokens. Primitive palette/scale values belong in `app/tokens.css`; components do not invent one-off colors, spacing, radii, or durations. The panel owns vertical overflow; the tab list and project step chains wrap, while the contribution grid owns its bounded horizontal viewport. `ProjectsPanel` opts into `--measure-wide` through the `--panel-measure` hook; other panels retain `--measure-body`. Intrinsic `auto-fit` collapse replaces width media queries.

### Accessibility

Query and test by role and accessible name. Preserve native anchors for real destinations. Use `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, and `role="tabpanel"` for file navigation. Keep a visible `:focus-visible` outline using the focus token. Decorative punctuation, branch glyphs, arrows, and contribution cells/legend swatches are presentational; semantic flow text and the contribution total remain available.

### Verification

Run `npm run typecheck`, `npm run lint`, and `npm test` before committing UI changes. Run `npm run build` for route/build changes. Browser checks remain necessary for focus visibility, reduced-motion behavior, theme flash, and narrow-width overflow because jsdom does not model those behaviors.
