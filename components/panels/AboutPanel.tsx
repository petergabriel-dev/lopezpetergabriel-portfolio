import { aboutContent } from "@/content/about";

import { AvailabilityBadge } from "../AvailabilityBadge";
import { TypingHeadline } from "../TypingHeadline";
import styles from "./AboutPanel.module.css";

export function AboutPanel() {
  return (
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{aboutContent.eyebrow}</p>
      <TypingHeadline text={aboutContent.headline} />
      {aboutContent.paragraphs.map((paragraph) => (
        <p className={styles.body} key={paragraph}>
          {paragraph}
        </p>
      ))}
      <AvailabilityBadge label={aboutContent.availability} />
    </div>
  );
}
