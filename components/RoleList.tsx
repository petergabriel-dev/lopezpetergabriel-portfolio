import { aboutContent } from "@/content/about";
import type { Education, Role } from "@/content/types";

import styles from "./RoleList.module.css";

type RoleListProps = {
  roles: readonly Role[];
  education: Education;
  /** Desktop role cards ("cards") or the mobile timeline with "Now" and education ("timeline"). */
  variant: "cards" | "timeline";
  className?: string;
};

export function RoleList({ roles, education, variant, className }: RoleListProps) {
  if (roles.length === 0) return null;
  const rootClass = (base: string) => [base, className].filter(Boolean).join(" ");

  if (variant === "cards") {
    return (
      <section className={rootClass(styles.cards)} aria-labelledby="roles-title">
        <h2 id="roles-title" className={styles.label}>
          Roles
        </h2>
        <ol className={styles.cardList}>
          {roles.map((role) => (
            <li key={`${role.org}-${role.title}`} className={styles.card}>
              <span className={styles.cardText}>
                <span className={styles.kind}>{role.kind ? `${role.kind} · ${role.location}` : role.location}</span>
                <span className={styles.title}>{role.title}</span>
                <span className={styles.org}>{role.org}</span>
              </span>
              <span className={styles.when}>
                <span className={styles.year}>{role.year}</span>
                <span className={styles.range}>{role.range}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  const { availability } = aboutContent;
  return (
    <ol className={rootClass(styles.timeline)} aria-label="Timeline">
      <li className={styles.step}>
        <span className={`${styles.dot} ${styles.dotNow}`} aria-hidden="true" />
        <span className={styles.stepText}>
          <span className={styles.kind}>Now</span>
          <span className={styles.stepTitle}>{availability.timelineTitle}</span>
          <span className={styles.stepOrg}>{availability.timelineNote}</span>
        </span>
      </li>
      {roles.map((role, index) => (
        <li key={`${role.org}-${role.title}`} className={styles.step}>
          <span className={`${styles.dot} ${index === 0 ? styles.dotCurrent : ""}`} aria-hidden="true" />
          <span className={styles.stepText}>
            <span className={styles.kind}>{role.timeline.meta}</span>
            <span className={styles.stepTitle}>{role.title}</span>
            <span className={styles.stepOrg}>{role.timeline.org}</span>
          </span>
        </li>
      ))}
      <li className={styles.step}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.stepText}>
          <span className={styles.kind}>{education.years.replace("–", " – ")} · Education</span>
          <span className={styles.stepTitle}>{education.degree}</span>
          <span className={styles.stepOrg}>{education.school}</span>
          <ul className={styles.honors}>
            {education.honors.map((honor) => (
              <li key={honor} className={styles.honor}>
                {honor}
              </li>
            ))}
          </ul>
        </span>
      </li>
    </ol>
  );
}
