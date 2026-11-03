/* global console, process, URL */
// Refresh the committed fallback snapshot. Usage: npm run sync:github (needs GITHUB_TOKEN in .env.local).

import { writeFile } from "node:fs/promises";

import { fetchGithubSnapshot } from "../lib/github-api.mjs";

const OUTPUT_URL = new URL("../content/github.ts", import.meta.url);

async function syncGithub() {
  const token = process.env.GITHUB_TOKEN?.trim();

  if (!token) {
    throw new Error("GITHUB_TOKEN is required in .env.local");
  }

  const snapshot = await fetchGithubSnapshot({ token });
  const output = `import type { GithubSnapshot } from "./types";\n\nexport const githubSnapshot: GithubSnapshot = ${JSON.stringify(snapshot, null, 2)};\n`;
  await writeFile(OUTPUT_URL, output, "utf8");
  console.log(`Wrote ${OUTPUT_URL.pathname}`);
}

try {
  await syncGithub();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
