import type { ExperienceEntry } from "@/content/types";

import styles from "./ExperienceRecord.module.css";

type ExperienceRecordProps = {
  entry: ExperienceEntry;
};

export function ExperienceRecord({ entry }: ExperienceRecordProps) {
  return (
    <article className={styles.record}>
      <div className={styles.key}>
        <span aria-hidden="true">&quot;</span>
        {entry.key}
        <span aria-hidden="true">&quot;</span>
      </div>
      <h3 className={styles.value}>{entry.value}</h3>
      <span className={styles.date}>
        <span aria-hidden="true">&quot;</span>
        {entry.date}
        <span aria-hidden="true">&quot;</span>
      </span>
      {entry.description ? <p className={styles.description}>{entry.description}</p> : null}
    </article>
  );
}
