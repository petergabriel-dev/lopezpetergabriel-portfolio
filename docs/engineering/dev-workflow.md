## Dev-workflow

### Local setup

Use Node 22 from `.nvmrc`, then install the committed lockfile:

```sh
npm ci
```

Run the development server with `npm run dev`. After a successful build, `npm run start` serves the production build. The route is static at build time; no local API or environment secret is required.

### Quality commands

- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm test` — Vitest in jsdom
- `npm run build` — Next production build and static prerender check

Vitest configuration is in `vitest.config.ts`; `vitest.setup.ts` installs Testing Library cleanup, a jsdom `matchMedia` stub, and storage cleanup. `tests/accessibility.test.tsx` covers tab ARIA/keyboard behavior, links, resume, headline, theme state, and axe scans for all four panels in both themes.

### CI

`.github/workflows/ci.yml` has one `quality` job. It runs on pushes to `dev` and pull requests targeting `main`, uses `actions/checkout@v4` and `actions/setup-node@v4`, reads Node from `.nvmrc`, enables npm caching, then runs `npm ci`, typecheck, lint, and test. There is no deploy step in Actions.

### Git and release path

The configured remote is:

```text
git@github-personal:petergabriel-dev/lopezpetergabriel-portfolio.git
```

`dev` accepts direct commits and produces CI runs. Changes intended for release move through a `dev` → `main` pull request. `main` is the GitHub default branch, requires the `quality` status check and one pull-request approval, enforces protections for admins, and rejects direct pushes.

Vercel is connected to the GitHub project outside this repository. Keep its production branch set explicitly to `main` and its Node major aligned with `.nvmrc`; `dev` pushes are expected to use Vercel preview deployments. Dashboard settings remain the source of truth for those external deployment details.
