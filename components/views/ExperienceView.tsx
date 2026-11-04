import { EducationCard } from "@/components/EducationCard";
import { Highlights } from "@/components/Highlights";
import { ResumeCard } from "@/components/ResumeCard";
import { RoleList } from "@/components/RoleList";
import { ToolkitGrid } from "@/components/ToolkitGrid";
import { education, experiencePage, highlights, roles, toolkit } from "@/content/experience";

import styles from "./ExperienceView.module.css";
import view from "./View.module.css";

/**
 * Desktop: section (hero + highlights, toolkit) beside aside (résumé, role cards, education).
 * Mobile: plain-div columns dissolve; order = hero -> timeline -> toolkit -> résumé. The résumé link is the
 * only focusable block that moves, and it stays last in both DOM and visual order.
 */
export function ExperienceView({ resumeSize }: { resumeSize: string }) {
  const [firstLine, secondLine] = experiencePage.titleLines;

  return (
    <div className={`${view.row} ${styles.row}`}>
      {/* No focusables in this column: tabIndex + region let WebKit keyboard users scroll it (ADR-0007). */}
      <div className={styles.main} tabIndex={0} role="region" aria-label="Experience overview and toolkit">
        <section className={styles.hero} aria-labelledby="experience-title">
          <span className={view.chip}>{experiencePage.chip}</span>
          <h1 id="experience-title" className={view.title}>
            {firstLine} <br className={styles.titleBreak} />
            {secondLine}
          </h1>
          <p className={`${view.intro} ${styles.body}`}>{experiencePage.body}</p>
          <Highlights items={highlights} label="At DILG Region VI" />
        </section>
        <ToolkitGrid areas={toolkit} className={styles.toolkit} />
      </div>

      <div className={styles.side}>
        <ResumeCard sizeLabel={resumeSize} className={styles.resume} />
        <RoleList roles={roles} education={education} variant="cards" className={styles.desktopOnly} />
        <RoleList roles={roles} education={education} variant="timeline" className={styles.timeline} />
        <EducationCard education={education} className={styles.desktopOnly} />
      </div>
    </div>
  );
}
