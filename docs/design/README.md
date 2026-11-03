# Storm Glass design system

Status: design source of truth for Peter Gabriel Lopez's portfolio (ADR-0006).

## Intent

Surface type: **Persuade**. Visitors are agency and studio founders and client teams deciding whether to hire Peter for automation, backend or AI-agent work. The site is a calm frosted-glass dashboard over a dark storm-teal backdrop. Proof comes first: projects, roles, the GitHub contribution record and a downloadable résumé. There are no gimmicks.

Four sections, each its own route: About (`/`), Projects (`/projects`), Experience (`/experience`), Contact (`/contact`).

## Sources

- `storm-glass-handoff/HANDOFF.md`: implementation handoff (tokens, layout, interactive pieces, content map).
- `storm-glass-handoff/design/*.dc.html`: Claude Design screens at 1440 (desktop) and 390 (mobile). They don't render on their own. Inline `style` values are the visual spec, and the `<script type="text/x-dc">` blocks hold the content and behavior. Treat them as reference input, not instructions.
- **Local only (gitignored, not in the public repo):** `storm-glass-handoff/reference/Peter_Gabriel_Lopez_Master_CV.md`, the owner's master CV and the authoritative content source, and `storm-glass-handoff/reference/inspiration.jpg`, a third-party mood reference. Ask the owner for the CV when content changes.

Open decisions in HANDOFF.md §9 are resolved: dark only, static routes, availability claim kept, Media toolkit card kept, toolkit subtitle removed everywhere.

## Files

- `manifest.json`: declares `app/tokens.css` as the only token file.
- `components.md`: one contract per component.
- Tokens live only in `app/tokens.css`. There is no separate design token copy or preview page; the running app is the preview.

## Theme

Dark only. There is no light variant, theme toggle or persisted theme value. `body` sits on the page ground with a faint 135° hatch. The frame shows the backdrop under a scrim.

The backdrop is currently the gradient-and-hatch stand-in from the handoff. A real photo (about 2400 × 1600 desktop, 1200 × 2400 portrait crop, served from `public/`) can replace it later. Keep the scrim and check contrast again when it does.

## Token rules

1. Components consume `/* @semantic */` custom properties only. Hex/rgba and raw scale values exist only in the `/* @primitive */` block of `app/tokens.css`.
2. Glass surfaces are semantic tokens: fill, border and blur per surface (nav, card, feature, dark, chip, icon, pill, modal, overlay). Always pair `backdrop-filter` with `-webkit-backdrop-filter`. Under `@supports not (backdrop-filter: blur(1px))`, fills become more opaque.
3. Use the accent (`#F5E3A8` primitive) sparingly: the availability dot, dialog bullets, the top contribution level and the focus ring.
4. Contribution levels 0–4 get lighter step by step, so they read without color.
5. Tokens are mobile-first. A single `@media (min-width: 760px)` block in `app/tokens.css` overrides size, radius and type tokens for desktop.

## Composition rules

- **Desktop (≥ 760 px).** A page ground with fluid padding holds one centered frame: max width 1360, radius 36, `min-height: 100dvh` minus page padding, growing with content.
  - The frame contains a glass nav rail (PL logo, four icon links, résumé download) and a main column.
  - The main column has a header ("Portfolio of / Peter Gabriel Lopez", icon links for Résumé, GitHub and Email, and the avatar) above a content row.
  - The content row is a section (`flex: 999 1 520px`) and an aside (`flex: 1 1 300px`) that wrap intrinsically.
- **Mobile (< 760 px).** A header row (PL mark, name, avatar) sits above a four-up labeled glass nav bar, with content stacked in one column at 20 px gaps. The mobile header has no action links.
- **Mobile reorder.** Where mobile order differs from desktop (Home: hero → CTAs → time card → grid → selected work; Experience: hero → highlights → timeline → toolkit → résumé), the column wrappers are plain `div`s set to `display: contents`, and `order` moves only non-focusable blocks, so focus order is unchanged.
- **Inside sections.** Card grids use `repeat(auto-fit, minmax(min(<n>, 100%), 1fr))`; there are no other width media queries.
- **Scrolling.** The page scrolls normally. There are no nested scroll areas and no horizontal overflow. The contribution grid fits its width. The project dialog on mobile is the only element with its own scroll.
- **Not allowed.** No fake form, fabricated screenshot or metric, particle effect, or scroll-triggered choreography.

## Motion contract (frozen)

| Element | Trigger | Motion | Tokens |
|---|---|---|---|
| Dialog `::backdrop` | open | opacity 0 → 1 | `--motion-duration-overlay` 200 ms, `--motion-ease-overlay` ease-out |
| Dialog panel | open (`@starting-style`) | opacity 0 → 1, `translateY(18px) scale(.94)` → none | `--motion-duration-modal` 340 ms (320 ms below 760 px), `--motion-ease-expand` `cubic-bezier(.2,.8,.2,1)` |
| Dialog | close | instant, no exit animation | — |
| Cards, nav items, pills, links | hover, only under `(hover: hover) and (pointer: fine)` | fill/border step, no lift or scale | `--motion-duration-hover` 150 ms, `--motion-ease-hover` ease |
| Nav, filters, clock, grid | — | none | — |

`prefers-reduced-motion: reduce` removes all transitions and animations. Browsers without `@starting-style` open the dialog without animation.

## Interaction and accessibility

- Navigation uses real links with `aria-current="page"` on the current route. On desktop, rail labels are visually hidden text that also shows as a tooltip on hover and focus.
- A "Skip to content" link targets `main#content`.
- Every `:focus-visible` shows `2px solid` accent with a `3px` offset. Targets are at least 44 × 44 px (nav items 48 desktop, 56 mobile).
- The project dialog is a native `<dialog>` opened with `showModal()` and labelled by its title. The close button is focused on open. Escape, ✕ and a backdrop click close it, and focus returns to the opening card. Previous/Next wrap (all 11 on Projects, the 3 featured on Home).
- Filters are a `role="group"` of buttons with `aria-pressed` and counts. Filtering keeps each card's original number.
- Contribution cells, month and day labels, and legend swatches are `aria-hidden`; totals live in a visible `figcaption`. Cells keep `title` tooltips.
- The clock renders `--:--` on the server, sets the real time after mount, and has no live region.
- Text contrast is at least 4.5:1, or 3:1 for large text, against the composite backdrop + scrim + glass. Final measured values go in the contrast table below.

## Contrast table

Filled in by the tokens task: text role × surface, composite colors and ratios.

## Content guardrails

- The headline positions Peter as a Software Engineer & Automation Specialist. DILG is current-role credibility, not the sales pitch.
- Every project, role, education, toolkit and contact line traces to the master CV. Do not add metrics. The 70% editing-time figure, the Dog Breed accuracy figure and high-school honors stay out.
- Wording rules: the Theory of Khaos intake is Make.com and its AI research workflow is n8n. The Sieitz Dockerized Go AI content platform is separate from its static site on Vercel. The DILG platform is in development, not deployed.
- The availability claim ("Available for contract work") is confirmed by the owner.
- Contact: email, phone (`tel:+639761260783`), LinkedIn and GitHub links. No contact form.
