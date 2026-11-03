## Dev-workflow

### Local setup

Use Node 22 from `.nvmrc`, then install the committed lockfile:

```sh
npm ci
```

Run the development server with `npm run dev`. After `npm run build`, `npm run start` serves the production build; use it to check ISR, because `next dev` always renders on demand.

### Quality commands

- `npm run typecheck`: `tsc --noEmit`. Run it after `npm run build` if you deleted a route, because stale `.next/types` can reference it.
- `npm run lint`: ESLint.
- `npm test`: Vitest in jsdom. Runs `tests/**/*.test.{ts,tsx}`.
- `npm run build`: Next production build. Confirm `/` and `/projects` show `Revalidate 1d` and the other routes `○ (Static)`.
- `npm run sync:github`: refreshes the committed `content/github.ts` fallback. Needs `GITHUB_TOKEN` in `.env.local`.

`vitest.setup.ts` installs Testing Library cleanup, a `matchMedia` stub, and `HTMLDialogElement.showModal`/`close` stubs, used only when jsdom lacks them. The tests cover:
- shell navigation (`aria-current` per route), the skip link and résumé links;
- the GitHub loader's fallback branches and normalization;
- contribution helpers and captions;
- the time card;
- dialog focus and keyboard behavior;
- each route view;
- axe scans.

### GitHub data

`GITHUB_TOKEN` is a server-only, read-only, expiring token. Never prefix it with `NEXT_PUBLIC_`, commit it, or add it to CI.
- **Local:** put it in gitignored `.env.local`. With it, local builds fetch live data; without it, everything uses the committed snapshot.
- **Vercel:** add it as an environment variable for Production and Preview. ISR then refreshes `/` and `/projects` at most once a day.
- **Refresh the fallback:** run `npm run sync:github`, review the diff and commit `content/github.ts`.

### Résumé and headshot assets

Regenerate `public/resume.pdf` (2 pages, A4) after editing `resume/resume.html`, then check the page count and the links:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --no-pdf-header-footer \
  --print-to-pdf=public/resume.pdf "file://$PWD/resume/resume.html"
```

Regenerate the 160×160 avatar from the owner's local headshot. The original is not committed.

```sh
cwebp -quiet -q 80 -crop 250 40 1260 1260 -resize 160 160 -metadata none ~/Downloads/headshot.png -o public/headshot.webp
```

### Browser QA

`playwright-cli` (with installed Chromium, Firefox and WebKit) drives a local `npm run start` server for screenshots, keyboard paths and media emulation via `run-code`. Run it from a scratch directory: it writes a `.playwright-cli/` folder in the working directory. Under zsh, write the full `playwright-cli -s=<session> …` command each time rather than storing it in a variable.

### CI

`.github/workflows/ci.yml` has one `quality` job. It runs on pushes to `dev` and pull requests targeting `main`, reads Node from `.nvmrc`, and runs `npm ci`, typecheck, lint and test. There is no deploy step and no secret in Actions.

### Git and release path

The configured remote is:

```text
git@github-personal:petergabriel-dev/lopezpetergabriel-portfolio.git
```

`dev` accepts direct commits and produces CI runs. Releases move through a `dev` → `main` pull request. `main` is the default branch: it requires the `quality` check and one approval, enforces protections for admins, and rejects direct pushes. Vercel's production branch must stay `main`, with Node aligned to `.nvmrc`. Dashboard settings are the source of truth.
