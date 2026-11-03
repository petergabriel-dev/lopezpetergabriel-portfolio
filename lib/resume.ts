// Server-only: reads the committed résumé at build time (static /experience route).
import { statSync } from "node:fs";
import { join } from "node:path";

export const RESUME_PATH = "/resume.pdf";

/** "PDF · 101 KB". Throws if public/resume.pdf is missing, so the build fails loudly. */
export function getResumeSizeLabel(root: string = process.cwd()): string {
  const bytes = statSync(join(root, "public", "resume.pdf")).size;
  return `PDF · ${Math.round(bytes / 1024)} KB`;
}
