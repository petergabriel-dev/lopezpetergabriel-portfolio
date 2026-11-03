import type { ContributionDay, ContributionLevel, ContributionWeek } from "@/content/types";

// Pure helpers for the contribution grid. All dates are ISO yyyy-mm-dd and handled in UTC.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const DAY_MS = 86_400_000;
const LABEL_SPAN = 3;

function utc(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

/** "Sep 14, 2025" */
export function formatDate(date: string): string {
  const d = utc(date);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function cellTitle(day: ContributionDay): string {
  const amount = day.count === 0 ? "No contributions" : day.count === 1 ? "1 contribution" : `${day.count} contributions`;
  return `${amount} on ${formatDate(day.date)}`;
}

export interface ContributionSummary {
  start: string;
  end: string;
  /** Sum of daily counts in these weeks. */
  total: number;
  activeDays: number;
  /** Highest daily count; the earliest day wins ties. */
  busiest: { count: number; date: string };
}

export function summarize(weeks: readonly ContributionWeek[]): ContributionSummary | null {
  const days = weeks.flatMap((week) => week.days);
  if (days.length === 0) return null;

  let total = 0;
  let activeDays = 0;
  let busiest = days[0];
  for (const day of days) {
    total += day.count;
    if (day.count > 0) activeDays += 1;
    if (day.count > busiest.count) busiest = day;
  }

  return {
    start: days[0].date,
    end: days[days.length - 1].date,
    total,
    activeDays,
    busiest: { count: busiest.count, date: busiest.date },
  };
}

export function lastWeeks(weeks: readonly ContributionWeek[], count: number): readonly ContributionWeek[] {
  return weeks.slice(-count);
}

export type GridCell = { kind: "day"; day: ContributionDay; level: ContributionLevel } | { kind: "pad" };

/** Cells in column order (Sunday first). Pads the first week by its first day's UTC weekday. */
export function gridCells(weeks: readonly ContributionWeek[]): readonly GridCell[] {
  const cells: GridCell[] = [];
  const firstDay = weeks[0]?.days[0];
  if (firstDay) {
    for (let i = 0; i < utc(firstDay.date).getUTCDay(); i += 1) cells.push({ kind: "pad" });
  }
  for (const week of weeks) {
    for (const day of week.days) cells.push({ kind: "day", day, level: day.level });
  }
  return cells;
}

export interface MonthLabel {
  label: string;
  /** 1-based grid column of the week. */
  column: number;
  span: number;
}

/**
 * Label a week when its Sunday starts a new month. Labels span 3 columns; a label fewer than
 * 3 columns after the previous one is dropped, except that it replaces the very first label.
 * A label without 3 columns left before the end is dropped so its text never overflows the grid.
 * January shows the year: "Jan ’26".
 */
export function monthLabels(weeks: readonly ContributionWeek[]): readonly MonthLabel[] {
  const labels: MonthLabel[] = [];
  let previousMonth = -1;

  weeks.forEach((week, index) => {
    const first = week.days[0];
    if (!first) return;
    const firstDate = utc(first.date);
    const sunday = new Date(firstDate.getTime() - firstDate.getUTCDay() * DAY_MS);
    const month = sunday.getUTCMonth();
    if (month === previousMonth) return;
    previousMonth = month;

    const column = index + 1;
    const label = month === 0 ? `Jan ’${String(sunday.getUTCFullYear()).slice(2)}` : MONTHS[month];
    const last = labels[labels.length - 1];
    const item = { label, column, span: LABEL_SPAN };

    if (weeks.length + 1 - column < LABEL_SPAN) return;
    if (!last || column - last.column >= LABEL_SPAN) labels.push(item);
    else if (labels.length === 1) labels[0] = item;
  });

  return labels;
}
