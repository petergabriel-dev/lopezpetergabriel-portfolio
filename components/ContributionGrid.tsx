import type { ContributionWeek } from "@/content/types";
import { cellTitle, formatDate, gridCells, lastWeeks, monthLabels, summarize } from "@/lib/contributions";

import styles from "./ContributionGrid.module.css";

const RECENT_WEEKS = 26;
const LEVELS = [0, 1, 2, 3, 4] as const;

type ContributionGridProps = {
  weeks: readonly ContributionWeek[];
  /** GitHub's one-year total. */
  total: number;
  /** "year": full calendar (desktop). "recent": last 26 weeks (mobile). */
  variant: "year" | "recent";
  className?: string;
};

export function ContributionGrid({ weeks, total, variant, className }: ContributionGridProps) {
  const shown = variant === "recent" ? lastWeeks(weeks, RECENT_WEEKS) : weeks;
  const summary = summarize(shown);
  const rootClass = [styles.figure, styles[variant], className].filter(Boolean).join(" ");

  if (!summary) {
    return (
      <figure className={rootClass}>
        <figcaption className={styles.caption}>No GitHub activity recorded</figcaption>
      </figure>
    );
  }

  const title =
    variant === "recent"
      ? "GitHub contributions · last 26 weeks"
      : `GitHub contributions · ${formatDate(summary.start)} – ${formatDate(summary.end)}`;
  const detail =
    variant === "recent"
      ? `${summary.total} since ${formatDate(summary.start)} · ${total} in the past year`
      : `${total} in the past year · ${summary.activeDays} active days`;
  const columns = { gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` };

  return (
    <figure className={rootClass}>
      <figcaption className={styles.caption}>
        <span>{title}</span> <span>{detail}</span>
      </figcaption>

      <div className={styles.body} aria-hidden="true">
        {variant === "year" ? <span className={styles.corner} /> : null}
        <div className={styles.months} style={columns}>
          {monthLabels(shown).map((month) => {
            // "Jan ’26": the year suffix hides when the grid is too narrow for it (container query).
            const [name, year] = month.label.split(" ");
            return (
              <span key={month.column} style={{ gridColumn: `${month.column} / span ${month.span}` }}>
                {name}
                {year ? <span className={styles.yearSuffix}> {year}</span> : null}
              </span>
            );
          })}
        </div>
        {variant === "year" ? (
          <div className={styles.days}>
            <span />
            <span>Mon</span>
            <span />
            <span>Wed</span>
            <span />
            <span>Fri</span>
            <span />
          </div>
        ) : null}
        <div className={styles.cells}>
          {gridCells(shown).map((cell, index) =>
            cell.kind === "pad" ? (
              <span key={`pad-${index}`} className={styles.pad} />
            ) : (
              <span key={cell.day.date} className={`${styles.cell} ${styles[`level${cell.level}`]}`} title={cellTitle(cell.day)} />
            ),
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <span>
          Busiest day: {summary.busiest.count} on {formatDate(summary.busiest.date)}
        </span>
        <span className={styles.legend} aria-hidden="true">
          Less
          {LEVELS.map((level) => (
            <span key={level} className={`${styles.swatch} ${styles[`level${level}`]}`} />
          ))}
          More
        </span>
      </div>
    </figure>
  );
}
