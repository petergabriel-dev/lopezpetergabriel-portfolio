"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

import { formatProjectNumber, projects as allProjects } from "@/content/projects";
import type { Project } from "@/content/types";

import { IconArrowUpRight, IconChevronLeft, IconChevronRight, IconClose } from "./icons";
import { TagChip } from "./TagChip";
import styles from "./ProjectDialog.module.css";

/**
 * Open/close state shared by ProjectGrid and FeaturedProjects. Remembers the trigger and focuses it on
 * close (Safari does not focus buttons on click, so the browser's own focus return is not enough).
 */
export function useProjectDialog() {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const open = useCallback((nextIndex: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setIndex(nextIndex);
  }, []);
  const onClose = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus();
  }, []);
  return { index, setIndex, open, onClose };
}

type ProjectDialogProps = {
  /** Projects that Previous/Next cycle through (all 11 on Projects, the 3 featured on Home). */
  items: readonly Project[];
  /** Index into `items`; null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  /** Called after the dialog closes by Escape, ✕ or a backdrop click. The parent restores focus. */
  onClose: () => void;
  /** Home adds an "All projects" link to the footer. */
  showAllProjectsLink?: boolean;
};

/**
 * Native modal dialog (focus containment, inert background, Escape) per ADR-0006.
 * Entry motion is CSS @starting-style; closing is instant.
 */
export function ProjectDialog({ items, index, onIndexChange, onClose, showAllProjectsLink = false }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const project = index === null ? null : items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  const step = (delta: number) => {
    if (index === null || items.length === 0) return;
    onIndexChange((index + delta + items.length) % items.length);
  };

  // The dialog fills the viewport; a click on it (not the panel) is a backdrop click.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) dialogRef.current?.close();
  };

  return (
    // Backdrop click closes; Escape is handled natively by the dialog.
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="project-dialog-title" onClick={handleClick}>
      {project ? (
        <div className={styles.panel}>
          <div className={styles.top}>
            <p className={styles.position}>
              <span>
                {formatProjectNumber(project)} / {String(allProjects.length).padStart(2, "0")}
              </span>
              <span className={styles.category}>{project.category}</span>
              <span>{project.period}</span>
            </p>
            <button ref={closeRef} type="button" className={styles.close} aria-label="Close" onClick={() => dialogRef.current?.close()}>
              <IconClose size={18} />
            </button>
          </div>

          <div className={styles.heading}>
            <h2 id="project-dialog-title" className={styles.title}>
              {project.title}
            </h2>
            <p className={styles.org}>{project.org}</p>
          </div>

          <p className={styles.summary}>{project.summary}</p>
          <hr className={styles.divider} />

          <section className={styles.built} aria-labelledby="project-dialog-built">
            <h3 id="project-dialog-built" className={styles.label}>
              What I built
            </h3>
            <ul className={styles.points}>
              {project.points.map((point) => (
                <li key={point} className={styles.point}>
                  <span className={styles.bullet} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <ul className={styles.tags} aria-label="Technologies">
            {project.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </ul>

          <div className={styles.footer}>
            <div className={styles.steps}>
              <button type="button" className={styles.pill} aria-label="Previous project" onClick={() => step(-1)}>
                <IconChevronLeft size={16} />
                Previous
              </button>
              <button type="button" className={styles.pill} aria-label="Next project" onClick={() => step(1)}>
                Next
                <IconChevronRight size={16} />
              </button>
            </div>
            {project.link || showAllProjectsLink ? (
              <div className={styles.links}>
                {project.link ? (
                  <a href={project.link.href} className={styles.primary} rel="noopener noreferrer">
                    {project.link.label}
                    <IconArrowUpRight size={16} />
                  </a>
                ) : null}
                {showAllProjectsLink ? (
                  <Link href="/projects" className={styles.pill}>
                    All projects
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
