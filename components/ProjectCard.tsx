import { Fragment } from "react";

import type { Project } from "@/content/types";

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
      {project.flow.length ? (
        <div className={styles.flowDiagram} role="img" aria-label={project.flow.map((step) => step.label).join(", ")}>
          <div className={styles.flowTrack}>
            {project.flow.map((step, index) => (
              <Fragment key={`${index}-${step.label}`}>
                {index > 0 ? (
                  <span className={styles.flowArrow} aria-hidden="true">
                    →
                  </span>
                ) : null}
                <span className={styles.flowNode}>{step.label}</span>
              </Fragment>
            ))}
          </div>
        </div>
      ) : null}
      {project.migrationNote ? <p className={styles.note}>{project.migrationNote}</p> : null}
    </article>
  );
}
