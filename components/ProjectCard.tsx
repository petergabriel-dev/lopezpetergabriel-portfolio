import type { MouseEvent } from "react";

import { formatProjectNumber } from "@/content/projects";
import type { Project } from "@/content/types";

import { IconExpand } from "./icons";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
  /**
   * "grid": Projects page (tall card from 760px, compact row below). "row": "All projects" list, compact
   * row at every width. "featured": Home "Selected work".
   */
  variant: "grid" | "row" | "featured";
  onOpen: (trigger: HTMLButtonElement) => void;
};

/** Opens the project dialog. A button holds phrasing content only, so tags are one text line, not a list. */
export function ProjectCard({ project, variant, onOpen }: ProjectCardProps) {
  const number = formatProjectNumber(project);
  const tagLine = project.tags.slice(0, 3).join(" · ");
  const titleId = `${variant}-${project.id}-title`;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => onOpen(event.currentTarget);

  if (variant === "featured") {
    return (
      <button type="button" className={styles.featured} aria-haspopup="dialog" aria-labelledby={titleId} onClick={handleClick}>
        <span className={styles.featuredText}>
          <span className={styles.meta}>{project.orgShort}</span>
          <span id={titleId} className={styles.title}>
            {project.title}
          </span>
          <span className={styles.tagLine}>{tagLine}</span>
        </span>
        <span className={styles.featuredNumber} aria-hidden="true">
          {number}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={variant === "grid" ? `${styles.card} ${styles.gridCard}` : styles.card}
      aria-haspopup="dialog"
      aria-labelledby={titleId}
      onClick={handleClick}
    >
      {/* One grid, two layouts: compact row by default; gridCard switches to the tall card at >= 760px. */}
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <span className={styles.category}>{project.category}</span>
      <span className={styles.kicker}>
        {project.category} · {project.period}
      </span>
      <span id={titleId} className={styles.title}>
        {project.title}
      </span>
      <span className={`${styles.meta} ${styles.metaDesktop}`}>
        {project.orgShort} · {project.period}
      </span>
      <span className={`${styles.meta} ${styles.metaMobile}`}>{project.orgShort}</span>
      <span className={styles.summary}>{project.summary}</span>
      <span className={`${styles.tagLine} ${styles.cardTags}`}>{tagLine}</span>
      <span className={styles.ring} aria-hidden="true">
        <IconExpand size={15} />
      </span>
    </button>
  );
}
