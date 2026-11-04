## Conventions

### TypeScript and components

Use strict TypeScript with the `@/*` project alias from `tsconfig.json`. Keep reusable content contracts in `content/types.ts`; export content as typed readonly arrays or readonly data objects. Prefer semantic HTML and named component exports.

Keep client boundaries narrow. Only `SectionNav` (pathname), `LocalTimeCard` (clock), `ProjectGrid` (filters, list-dialog and project-dialog state), `ProjectDialog` and `FeaturedProjects` use `'use client'`. Route pages are thin async wrappers that load data and render synchronous view components from `components/views/`, which keeps views testable. Server-only modules such as `lib/github.ts` and `lib/resume.ts` are imported only from server code.

Icons are inline SVG components in `components/icons.tsx`: `aria-hidden`, `stroke="currentColor"`, no icon library. GitHub uses a generic branch icon, not a logo.

Components receive content through props or content modules. Do not fabricate copy, metrics, screenshots, project outcomes, role records or URLs. Represent a missing external URL with an absent `href`, not a placeholder anchor.

### CSS

Use one CSS Module beside each component or view. Consume semantic custom properties only. Primitive palette and scale values live in `app/tokens.css` under `/* @primitive */`, and semantic roles under `/* @semantic */`. Components do not invent one-off colors, spacing, radii, blurs, shadows or durations.

Layouts are mobile-first with exactly one breakpoint value, `(min-width: 760px)`. It appears in `app/tokens.css` and in component and view modules for desktop layouts; no other width media query exists. Inside sections, prefer intrinsic `repeat(auto-fit, minmax(min(<n>, 100%), 1fr))` grids. When a component must adapt to its own width, use a container query (`container-type: inline-size`) rather than a new viewport breakpoint.

Scrolling follows ADR-0007. Don't add scroll areas beyond `main#content`, the two view columns and dialog panels. A scroller gets `overflow-y: auto`, `min-height: 0`, `overscroll-behavior: contain`, `scroll-padding-block: var(--space-scroll-inset)`, a thin `--color-scrollbar-thumb` scrollbar, and `--space-scroll-inset` padding cancelled by an equal negative margin so edge focus rings stay inside the clip; a focusable scroller uses an inset ring. Whether `main#content` or the columns scroll is decided only by `@container content (min-width: 848px)` in `components/views/View.module.css`.

Always pair `backdrop-filter` with `-webkit-backdrop-filter`. Gate hover styles behind `@media (hover: hover) and (pointer: fine)`. Use `display: contents` only on non-semantic wrapper `div`s.

### Accessibility

Query and test by role and accessible name. Use native anchors for destinations and buttons for actions. Buttons contain phrasing content only, so card tags are spans, not lists. Each route has one `h1`. Decorative icons, contribution cells, month and day labels, and legend swatches are `aria-hidden`; contribution totals stay in a visible `figcaption`. The clock updates without a live region. A view column that can scroll but holds no focusable content (Home and Experience main columns) is a labelled focusable region (`tabIndex={0}`, `role="region"`, `aria-label`) so WebKit keyboard users can scroll it; columns with links or buttons get no extra tab stop.

### Verification

Run `npm run typecheck`, `npm run lint` and `npm test` before committing UI changes. Run `npm run build` for route, data or layout changes, and confirm `/` and `/projects` report a 1-day revalidate. Browser checks remain necessary for focus visibility, reduced-motion behavior, WebKit `backdrop-filter`, narrow-width overflow, contrast over the backdrop, and the locked layout (document `scrollHeight === innerHeight`, every scroller inside the frame and reaching its end, keyboard scrolling, stacked dialogs), because jsdom does not model them.
