# Portfolio editor design system

Status: design source of truth for Peter Gabriel Lopez's portfolio.

## Intent

The portfolio is a single-page code editor, not a resume dashboard. Visitors open four file tabs to inspect proof of backend, automation, and AI-agent work:

`about.md` → `projects.tsx` → `experience.json` → `contact.md`

Primary audience: design-conscious agency founders and studio owners looking for a freelance or contract automation partner.

## Existing-system decision

Repository inspection found no app source, component library, stylesheet, or theme convention to extend. This system is therefore the initial system. No named base library is assumed; later implementation should use platform HTML semantics and these tokens before adding a dependency.

## Files

- `tokens.css` — primitive and semantic CSS custom properties.
- `components.md` — foundation component contracts.
- `preview.html` — single-column visual preview.
- `preview.css` — preview-only composition styles using tokens.
- `preview.js` — light/dark theme switch for preview.

## Theme convention

Set `data-theme="light"` or `data-theme="dark"` on `<html>`. Omit attribute or use `light` for default light mode. Theme controls must update the root attribute and expose the current theme in their accessible name. Semantic color tokens have explicit light and dark definitions in `tokens.css`.

Preview theme control is only a design-preview aid. Production implementation should preserve the user's system preference when no explicit choice exists, then persist an explicit choice only if product requirements call for persistence.

## Token rules

1. Use semantic tokens in components. Do not consume primitive color values directly.
2. Use `var(--token)` for spacing, type, radius, borders, motion, and color. Do not invent one-off values.
3. `@primitive` values are palette, scale, and font foundations. `@semantic` values express role and may change by theme.
4. Accent colors carry meaning: blue = links/actions, green = availability/success, purple = secondary emphasis, orange = dates/warnings.
5. Keep body copy within `var(--measure-body)` and use `var(--font-family-body)`. Use `var(--font-family-mono)` for editor chrome, labels, tabs, tags, keys, and values.

## Composition rules

- One editor shell locks to the visible viewport with a `100dvh` block size and `40rem` minimum, keeping panel scrolling inside the frame at normal heights without creating a second navigation system.
- Four tabs stay in spec order. Tab row wraps onto additional rows on narrow screens; it never becomes a side-scrolling control, a dropdown, or bottom nav.
- Main content swaps in place. Do not add scroll-triggered section choreography.
- Status bar remains visible at the shell bottom. Its center availability message may wrap on narrow screens.
- The projects panel uses intrinsic columns when space allows, with project cards stacked in the first column. Step chains wrap; the contribution grid owns its bounded horizontal viewport.
- No sidebar, decorative gradient, particle effect, fake form, or fabricated project screenshot.

## Interaction and accessibility

- Every tab is a keyboard-focusable button with `role="tab"`, `aria-selected`, and a roving or predictable tab sequence. Active tab controls one `tabpanel`.
- Focus uses `--color-border-focus` plus a visible offset; never rely on color alone.
- Preserve native link semantics for email, GitHub, LinkedIn, and resume download.
- Respect `prefers-reduced-motion: reduce`: skip headline typing and panel motion, show final headline immediately.
- Availability is stated in text, not only by pulsing color. Pulse is optional and stops under reduced motion.
- Syntax coloring is supplemental; rendered experience content stays legible prose.

## Motion contract

- One load-time typing reveal for the about headline. It runs once, then leaves a short cursor blink.
- Tab changes use a quick opacity/position transition on the panel only.
- Project cards and tags may use a restrained hover lift or border emphasis.
- No animation is required for comprehension. Reduced motion removes all nonessential transitions.

## Content guardrails

- Headline positions Peter as a backend engineer and AI automation specialist.
- DILG is credibility and stability context, not the primary sales headline.
- Case studies always state problem → build → outcome where source material supports it.
- Use semantic step chains and contribution cells only from verified content. Never imply a screenshot or metric that is not verified.
- LinkedIn remains a labeled placeholder until the real profile URL is supplied.

## Handoff

This is design-system work only. Build mode should translate these contracts into app components, wire the four panels, embed the real resume PDF, and add implementation tests without changing token roles or accessibility behavior.
