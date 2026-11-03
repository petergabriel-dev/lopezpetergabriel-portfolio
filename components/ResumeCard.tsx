import { RESUME_PATH } from "@/lib/resume";

import { IconDownload, IconResume } from "./icons";
import styles from "./ResumeCard.module.css";

/** The full-résumé download. `sizeLabel` comes from getResumeSizeLabel() at build time. */
export function ResumeCard({ sizeLabel, className }: { sizeLabel: string; className?: string }) {
  const size = sizeLabel.replace("PDF · ", "");

  return (
    <a
      href={RESUME_PATH}
      download="Peter-Gabriel-Lopez-Resume.pdf"
      className={[styles.card, className].filter(Boolean).join(" ")}
      aria-label={`Download full résumé (PDF, ${size})`}
    >
      <span className={styles.label}>
        <IconResume className={styles.labelIcon} />
        Full résumé
      </span>
      <span className={styles.row}>
        <span className={styles.download}>Download</span>
        <span className={styles.circle} aria-hidden="true">
          <IconDownload strokeWidth={2} />
        </span>
      </span>
      <span className={styles.size}>{sizeLabel}</span>
    </a>
  );
}
