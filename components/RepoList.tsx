import type { GithubSnapshot } from "@/content/types";

import styles from "./RepoList.module.css";

type RepoListProps = {
  profileUrl: GithubSnapshot["profileUrl"];
  repos: GithubSnapshot["repos"];
};

const updatedDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

function formatUpdatedDate(value: string) {
  return updatedDateFormatter.format(new Date(value));
}

export function RepoList({ profileUrl, repos }: RepoListProps) {
  if (!repos.length) {
    return null;
  }

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {repos.map((repo) => (
          <li className={styles.row} key={repo.url}>
            <h3 className={styles.name}>
              <a className={styles.repoLink} href={repo.url} rel="noopener noreferrer">
                {repo.name}
              </a>
            </h3>
            {repo.description ? <p className={styles.description}>{repo.description}</p> : null}
            <div className={styles.meta}>
              <span>{`Language: ${repo.language ?? "—"}`}</span>
              <span>{`${repo.stars} ${repo.stars === 1 ? "star" : "stars"}`}</span>
              <time dateTime={repo.pushedAt}>{`Updated ${formatUpdatedDate(repo.pushedAt)}`}</time>
            </div>
          </li>
        ))}
      </ul>
      <a className={styles.profileLink} href={profileUrl} rel="noopener noreferrer">
        View all repositories on GitHub
      </a>
    </div>
  );
}
