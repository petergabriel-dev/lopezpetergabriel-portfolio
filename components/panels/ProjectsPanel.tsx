import { githubSnapshot } from "@/content/github";
import { projects, projectsContent } from "@/content/projects";

import { ContributionGrid } from "../ContributionGrid";
import { ProjectCard } from "../ProjectCard";
import { RepoList } from "../RepoList";
import styles from "./ProjectsPanel.module.css";

const syncedDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

export function ProjectsPanel() {
  return (
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{projectsContent.eyebrow}</p>
      <div className={styles.columns}>
        <section className={styles.column} aria-labelledby="projects-heading">
          <h2 className={styles.heading} id="projects-heading">
            {projectsContent.heading}
          </h2>
          <div className={styles.stack}>
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
        <section className={`${styles.column} ${styles.githubColumn}`} aria-labelledby="github-heading">
          <h2 className={styles.heading} id="github-heading">
            GitHub activity
          </h2>
          <ContributionGrid contributions={githubSnapshot.contributions} />
          <p className={styles.syncDate}>
            Snapshot synced {syncedDateFormatter.format(new Date(githubSnapshot.syncedAt))}
          </p>
          <RepoList profileUrl={githubSnapshot.profileUrl} repos={githubSnapshot.repos} />
        </section>
      </div>
    </div>
  );
}
