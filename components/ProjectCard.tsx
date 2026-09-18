import type { Project } from "@/content/types";

import { FlowDiagram } from "./FlowDiagram";
import styles from "./ProjectCard.module.css";
import { TagChip } from "./TagChip";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <p className={styles.context}>{project.context}</p>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.copy}>{project.copy}</p>
      <ul className={styles.tags} aria-label="Technologies">
        {project.tags.map((tag) => (
          <TagChip key={tag} label={tag} />
        ))}
      </ul>
      <FlowDiagram steps={project.flow} />
      {project.migrationNote ? <p className={styles.note}>{project.migrationNote}</p> : null}
    </article>
  );
}
