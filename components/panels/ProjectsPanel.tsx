import { projects, projectsContent } from "@/content/projects";

import { ProjectCard } from "../ProjectCard";
import styles from "./ProjectsPanel.module.css";

export function ProjectsPanel() {
  return (
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{projectsContent.eyebrow}</p>
      <h2 className={styles.heading}>{projectsContent.heading}</h2>
      <div className={styles.stack}>
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
