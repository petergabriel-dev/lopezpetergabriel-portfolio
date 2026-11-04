import Link from "next/link";

import { ContributionGrid } from "@/components/ContributionGrid";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { IconDownload, IconMail } from "@/components/icons";
import { LocalTimeCard } from "@/components/LocalTimeCard";
import { aboutContent } from "@/content/about";
import { contactLinks } from "@/content/contact";
import type { GithubSnapshot, Project } from "@/content/types";

import styles from "./HomeView.module.css";
import view from "./View.module.css";

type HomeViewProps = {
  snapshot: GithubSnapshot;
  featured: readonly Project[];
  projectCount: number;
};

/**
 * Desktop: section (hero, grid) beside aside (time card, selected work).
 * Mobile: the plain-div columns become display:contents and `order` gives hero -> time card -> grid ->
 * selected work. Only non-focusable blocks move, so focus order still follows the DOM.
 */
export function HomeView({ snapshot, featured, projectCount }: HomeViewProps) {
  const { weeks, total } = snapshot.contributions;
  const [firstLine, secondLine] = aboutContent.titleLines;

  return (
    <div className={`${view.row} ${styles.row}`}>
      {/* No focusables here on desktop: tabIndex + region let WebKit keyboard users scroll the column (ADR-0007). */}
      <div className={styles.main} tabIndex={0} role="region" aria-label="Introduction and GitHub activity">
        <section className={styles.hero} aria-labelledby="home-title">
          <span className={view.chip}>{aboutContent.role}</span>
          <h1 id="home-title" className={view.title}>
            {firstLine} <br className={styles.titleBreak} />
            {secondLine}
          </h1>
          <p className={`${view.intro} ${styles.body}`}>{aboutContent.body}</p>
          <div className={styles.ctas}>
            <a href={contactLinks.email.href} className={`${view.cta} ${view.ctaPrimary}`}>
              <IconMail size={18} />
              Email Peter
            </a>
            <a
              href="/resume.pdf"
              download="Peter-Gabriel-Lopez-Resume.pdf"
              className={`${view.cta} ${view.ctaSecondary}`}
              aria-label="Download résumé (PDF)"
            >
              <IconDownload size={18} />
              Résumé
            </a>
          </div>
        </section>
        <div className={styles.grid}>
          <div className={styles.gridYear}>
            <ContributionGrid weeks={weeks} total={total} variant="year" />
          </div>
          <div className={styles.gridRecent}>
            <ContributionGrid weeks={weeks} total={total} variant="recent" />
          </div>
        </div>
      </div>

      <div className={styles.side}>
        <div className={styles.time}>
          <LocalTimeCard detail="availability" />
        </div>
        <section className={styles.selected} aria-labelledby="selected-title">
          <div className={styles.selectedHeader}>
            <h2 id="selected-title" className={styles.selectedTitle}>
              Selected work
            </h2>
            <Link href="/projects" className={styles.allLink}>
              All {projectCount} projects
            </Link>
          </div>
          <FeaturedProjects projects={featured} />
        </section>
      </div>
    </div>
  );
}
