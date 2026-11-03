import type { Education } from "@/content/types";

import roles from "./RoleList.module.css";
import styles from "./EducationCard.module.css";

/** Desktop aside card. On mobile, education is the last step of the RoleList timeline. */
export function EducationCard({ education, className }: { education: Education; className?: string }) {
  return (
    <section className={[styles.section, className].filter(Boolean).join(" ")} aria-labelledby="education-title">
      <h2 id="education-title" className={roles.label}>
        Education
      </h2>
      <div className={styles.card}>
        <div className={styles.row}>
          <span className={roles.cardText}>
            <span className={roles.title}>{education.degree}</span>
            <span className={roles.org}>{education.school}</span>
          </span>
          <span className={roles.when}>
            <span className={roles.year}>{education.year}</span>
            <span className={roles.range}>{education.years}</span>
          </span>
        </div>
        <ul className={roles.honors} aria-label="Honors">
          {education.honors.map((honor) => (
            <li key={honor} className={roles.honor}>
              {honor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
