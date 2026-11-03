"use client";

import { useState } from "react";

import type { Project, ProjectCategory } from "@/content/types";

import { ProjectCard } from "./ProjectCard";
import { ProjectDialog, useProjectDialog } from "./ProjectDialog";
import styles from "./ProjectGrid.module.css";

type Filter = "All" | ProjectCategory;
const FILTERS: readonly Filter[] = ["All", "Work", "Independent", "Academic"];

/** Category filters + card grid. Filtering keeps original numbers; the dialog cycles every project. */
export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const dialog = useProjectDialog();
  const visible = filter === "All" ? projects : projects.filter((project) => project.category === filter);
  const count = (option: Filter) =>
    option === "All" ? projects.length : projects.filter((project) => project.category === option).length;

  return (
    <>
      <div role="group" aria-label="Filter projects" className={styles.filters}>
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            className={styles.filter}
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
          >
            {option} <span className={styles.count}>{count(option)}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>No projects in this category</p>
      ) : (
        <ul className={styles.grid}>
          {visible.map((project) => (
            <li key={project.id} className={styles.item}>
              <ProjectCard
                project={project}
                variant="grid"
                onOpen={(trigger) => dialog.open(projects.findIndex((candidate) => candidate.id === project.id), trigger)}
              />
            </li>
          ))}
        </ul>
      )}

      <ProjectDialog items={projects} index={dialog.index} onIndexChange={dialog.setIndex} onClose={dialog.onClose} />
    </>
  );
}
