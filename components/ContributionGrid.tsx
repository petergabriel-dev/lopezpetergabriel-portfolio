import type { GithubSnapshot } from "@/content/types";

import styles from "./ContributionGrid.module.css";

type ContributionGridProps = {
  contributions: GithubSnapshot["contributions"];
};

type MonthLabel = {
  column: number;
  label: string;
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

function monthLabels(weeks: GithubSnapshot["contributions"]["weeks"]): readonly MonthLabel[] {
  const labels: MonthLabel[] = [];
  const seenMonths = new Set<string>();

  weeks.forEach((week, column) => {
    week.days.forEach((day) => {
      const monthKey = day.date.slice(0, 7);

      if (seenMonths.has(monthKey)) {
        return;
      }

      seenMonths.add(monthKey);
      labels.push({
        column,
        label: monthFormatter.format(new Date(`${day.date}T00:00:00Z`)),
      });
    });
  });

  return labels.slice(-12);
}

export function ContributionGrid({ contributions }: ContributionGridProps) {
  const labels = monthLabels(contributions.weeks);
  const gridColumns = `repeat(${contributions.weeks.length}, var(--space-3))`;
  const accessibleName = `${contributions.total} contributions in the last year`;

  return (
    <div className={styles.viewport} role="img" aria-label={accessibleName}>
      <div className={styles.content}>
        <p className={styles.total}>{accessibleName}</p>
        <div className={styles.months} style={{ gridTemplateColumns: gridColumns }}>
          {labels.map((month) => (
            <span key={`${month.column}-${month.label}`} style={{ gridColumnStart: month.column + 1 }}>
              {month.label}
            </span>
          ))}
        </div>
        <div className={styles.calendar} style={{ gridTemplateColumns: gridColumns }}>
          {contributions.weeks.map((week, column) => (
            <div className={styles.week} key={week.days[0]?.date ?? `week-${column}`}>
              {week.days.map((day) => (
                <span
                  aria-hidden="true"
                  className={`${styles.cell} ${styles[`level${day.level}`]}`}
                  key={day.date}
                />
              ))}
            </div>
          ))}
        </div>
        <div className={styles.legend} aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span className={`${styles.swatch} ${styles[`level${level}`]}`} key={level} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
