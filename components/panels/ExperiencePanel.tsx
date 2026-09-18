import { experience, experienceContent } from "@/content/experience";

import { ExperienceRecord } from "../ExperienceRecord";
import styles from "./ExperiencePanel.module.css";

export function ExperiencePanel() {
  return (
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{experienceContent.eyebrow}</p>
      <h2 className={styles.heading}>{experienceContent.heading}</h2>
      <div className={styles.stack}>
        {experience.map((entry) => (
          <ExperienceRecord key={entry.value} entry={entry} />
        ))}
      </div>
    </div>
  );
}
