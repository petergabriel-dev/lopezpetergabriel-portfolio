"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import type { Project, ProjectCategory } from "@/content/types";

import { IconClose } from "./icons";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog, useProjectDialog } from "./ProjectDialog";
import styles from "./ProjectGrid.module.css";

type Filter = "All" | ProjectCategory;
const FILTERS: readonly Filter[] = ["All", "Work", "Independent", "Academic"];

/**
 * Projects page (ADR-0007): the featured cards, then "More projects", which opens the "All projects" list
 * dialog with the filters inside. Every card and row opens the one ProjectDialog; from the list it stacks
 * above it, and closing it returns focus to the row with the list and filter intact. Numbers stay original
 * and the project dialog cycles every project.
 */
export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [listOpen, setListOpen] = useState(false);
  const listRef = useRef<HTMLDialogElement>(null);
  const listCloseRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const dialog = useProjectDialog();

  const featured = projects.filter((project) => project.featured);
  const remaining = projects.length - featured.length;
  const visible = filter === "All" ? projects : projects.filter((project) => project.category === filter);
  const count = (option: Filter) =>
    option === "All" ? projects.length : projects.filter((project) => project.category === option).length;
  const openProject = (project: Project, trigger: HTMLElement) =>
    dialog.open(
      projects.findIndex((candidate) => candidate.id === project.id),
      trigger,
    );

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (listOpen && !list.open) {
      list.showModal();
      listCloseRef.current?.focus();
    } else if (!listOpen && list.open) {
      list.close();
    }
  }, [listOpen]);

  // Escape, ✕ and backdrop all end in "close". Refocus the trigger: Safari doesn't focus buttons on click.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onClose = () => {
      setListOpen(false);
      moreRef.current?.focus();
    };
    list.addEventListener("close", onClose);
    return () => list.removeEventListener("close", onClose);
  }, []);

  // The dialog fills the viewport; a click on it (not the panel) is a backdrop click.
  const handleListClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === listRef.current) listRef.current?.close();
  };

  return (
    <>
      {featured.length > 0 ? (
        <ul className={styles.grid}>
          {featured.map((project) => (
            <li key={project.id} className={styles.item}>
              <ProjectCard project={project} variant="grid" onOpen={(trigger) => openProject(project, trigger)} />
            </li>
          ))}
        </ul>
      ) : null}

      {remaining > 0 ? (
        <button
          ref={moreRef}
          type="button"
          className={`${styles.filter} ${styles.more}`}
          aria-haspopup="dialog"
          onClick={() => setListOpen(true)}
        >
          More projects <span className={styles.count}>{remaining}</span>
        </button>
      ) : null}

      <dialog ref={listRef} className={styles.dialog} aria-labelledby="project-list-title" onClick={handleListClick}>
        {listOpen ? (
          <div className={styles.panel}>
            <div className={styles.top}>
              <h2 id="project-list-title" className={styles.title}>
                All projects <span className={styles.count}>{projects.length}</span>
              </h2>
              <button
                ref={listCloseRef}
                type="button"
                className={styles.close}
                aria-label="Close"
                onClick={() => listRef.current?.close()}
              >
                <IconClose size={18} />
              </button>
            </div>

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
              <ul className={styles.list}>
                {visible.map((project) => (
                  <li key={project.id} className={styles.item}>
                    <ProjectCard project={project} variant="row" onOpen={(trigger) => openProject(project, trigger)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </dialog>

      <ProjectDialog items={projects} index={dialog.index} onIndexChange={dialog.setIndex} onClose={dialog.onClose} />
    </>
  );
}
