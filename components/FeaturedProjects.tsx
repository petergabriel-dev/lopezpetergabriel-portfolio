"use client";

import type { Project } from "@/content/types";

import { ProjectCard } from "./ProjectCard";
import { ProjectDialog, useProjectDialog } from "./ProjectDialog";
import styles from "./FeaturedProjects.module.css";

/** Home "Selected work": featured cards; the dialog cycles only these and links to all projects. */
export function FeaturedProjects({ projects }: { projects: readonly Project[] }) {
  const dialog = useProjectDialog();
  if (projects.length === 0) return null;

  return (
    <>
      <ul className={styles.list}>
        {projects.map((project, i) => (
          <li key={project.id} className={styles.item}>
            <ProjectCard project={project} variant="featured" onOpen={(trigger) => dialog.open(i, trigger)} />
          </li>
        ))}
      </ul>
      <ProjectDialog
        items={projects}
        index={dialog.index}
        onIndexChange={dialog.setIndex}
        onClose={dialog.onClose}
        showAllProjectsLink
      />
    </>
  );
}
