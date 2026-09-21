import type { Project } from "@/content/types";

import styles from "./ProjectCard.module.css";
import { TagChip } from "./TagChip";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card} tabIndex={0}>
      <p className={styles.context}>{project.context}</p>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.copy}>{project.copy}</p>
      <ul className={styles.tags} aria-label="Technologies">
        {project.tags.map((tag) => (
          <TagChip key={tag} label={tag} />
        ))}
      </ul>
    </article>
  );
}
