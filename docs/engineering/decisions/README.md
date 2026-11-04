# Decisions

| ADR | Status | Summary | Read when |
|---|---|---|---|
| ADR-0001 | Active | Use Next.js App Router for the portfolio site | Use Next.js 16 App Router with TypeScript for the site route. |
| ADR-0002 | Active | Use CSS Modules with semantic design tokens | Keep primitives and theme roles in `app/tokens.css`. |
| ADR-0003 | Active | Separate dev and main delivery with GitHub CI and Vercel | Use `dev` for direct development pushes and `main` for protected releases. |
| ADR-0004 | Superseded | Lock editor frame and keep scrolling in active panels | Historical only; superseded by ADR-0006 on 2026-11-03. |
| ADR-0005 | Active | Refresh GitHub activity with daily ISR and a committed snapshot fallback | Change GitHub data fetching, revalidation, fallback, snapshot generation, token handling, or repository selection. |
| ADR-0006 | Active | Replace the editor UI with the Storm Glass dashboard | Change the Storm Glass shell, routes, navigation, theme, breakpoint, fonts, content scope, or project dialog. |
| ADR-0007 | Active | Lock the Storm Glass frame to the viewport with column scrolling | Change page, frame or column scrolling, frame sizing, view column flex bases, the Projects page card count, the "All projects" list dialog, or nav rail stacking. |
