import type { GithubRepo } from "@/content/types";

import { IconArrowUpRight } from "./icons";
import styles from "./RepoList.module.css";

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

type RepoListProps = {
  repos: readonly GithubRepo[];
  profileUrl: string;
  limit?: number;
};

/** Recently pushed public repositories. No scrolling; shows the first `limit` (snapshot order is newest first). */
export function RepoList({ repos, profileUrl, limit = 6 }: RepoListProps) {
  const shown = repos.slice(0, limit);

  return (
    <section className={styles.section} aria-labelledby="repos-title">
      <div className={styles.header}>
        <h2 id="repos-title" className={styles.title}>
          Recently pushed on GitHub
        </h2>
        <a href={profileUrl} className={styles.profile} rel="noopener noreferrer">
          Profile
        </a>
      </div>
      {shown.length === 0 ? (
        <p className={styles.empty}>No public repositories yet</p>
      ) : (
        <ul className={styles.list}>
          {shown.map((repo) => (
            <li key={repo.url}>
              <a href={repo.url} className={styles.repo} rel="noopener noreferrer">
                <span className={styles.text}>
                  <span className={styles.name}>{repo.name}</span>{" "}
                  <span className={styles.meta}>
                    {repo.language ? `${repo.language} · ` : ""}
                    {shortDate.format(new Date(repo.pushedAt))}
                  </span>
                </span>
                <IconArrowUpRight size={16} className={styles.arrow} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
