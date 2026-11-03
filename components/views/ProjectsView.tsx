import { ProjectGrid } from "@/components/ProjectGrid";
import { RepoList } from "@/components/RepoList";
import { projectsPage } from "@/content/projects";
import type { GithubSnapshot, Project } from "@/content/types";

import styles from "./View.module.css";

type ProjectsViewProps = {
  projects: readonly Project[];
  snapshot: GithubSnapshot;
};

export function ProjectsView({ projects, snapshot }: ProjectsViewProps) {
  return (
    <div className={styles.row}>
      <section className={styles.section} aria-labelledby="projects-title">
        <span className={styles.chip}>
          {projectsPage.chip} · {projects.length} builds
        </span>
        <h1 id="projects-title" className={styles.title}>
          {projectsPage.title}
        </h1>
        <p className={styles.intro}>{projectsPage.intro}</p>
        <ProjectGrid projects={projects} />
      </section>
      <aside className={styles.aside} aria-label="Recently pushed on GitHub">
        <RepoList repos={snapshot.repos} profileUrl={snapshot.profileUrl} />
      </aside>
    </div>
  );
}
