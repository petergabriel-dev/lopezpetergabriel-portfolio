## Conventions

### TypeScript and components

Use strict TypeScript with the `@/*` project alias from `tsconfig.json`. Keep reusable content contracts in `content/types.ts`; export content as typed readonly arrays or readonly data objects. Prefer semantic HTML and named component exports. Keep client boundaries narrow: add `'use client'` only for browser state, effects, or keyboard interaction (`EditorTabBar`, `ThemeToggle`, `TypingHeadline`).

Components receive content through props or content modules. Do not fabricate copy, metrics, screenshots, project outcomes, role records, or URLs. A missing external URL is represented by an absent `ContactLink.href`, not a placeholder anchor.

### CSS

Use one CSS Module beside each component or panel. Consume semantic variables such as `--color-content-primary`, `--space-*`, `--font-family-*`, and motion tokens. Primitive palette/scale values belong in `app/tokens.css`; components do not invent one-off colors, spacing, radii, or durations. Responsive overflow belongs to its owner: the tab list wraps onto additional rows instead of scrolling horizontally, and each flow diagram owns its own bounded horizontal scroll.

### Accessibility

Query and test by role and accessible name. Preserve native anchors for real destinations. Use `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, and `role="tabpanel"` for file navigation. Keep a visible `:focus-visible` outline using the focus token. Decorative punctuation, branch glyphs, arrows, and SVG presentation are `aria-hidden`; their semantic text alternative remains available.

### Verification

Run `npm run typecheck`, `npm run lint`, and `npm test` before committing UI changes. Run `npm run build` for route/build changes. Browser checks remain necessary for focus visibility, reduced-motion behavior, theme flash, and narrow-width overflow because jsdom does not model those behaviors.
