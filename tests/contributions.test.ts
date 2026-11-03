import { describe, expect, it } from "vitest";

import type { ContributionLevel, ContributionWeek } from "@/content/types";
import { cellTitle, formatDate, gridCells, lastWeeks, monthLabels, summarize } from "@/lib/contributions";

const DAY = 86_400_000;

/** Weeks from a Sunday; the last week may be partial. `counts[i]` is day i. */
function weeksFrom(start: string, counts: number[]): ContributionWeek[] {
  const base = Date.parse(`${start}T00:00:00Z`);
  const weeks: ContributionWeek[] = [];
  counts.forEach((count, i) => {
    if (i % 7 === 0) weeks.push({ days: [] });
    const date = new Date(base + i * DAY).toISOString().slice(0, 10);
    const level = Math.min(4, count) as ContributionLevel;
    (weeks[weeks.length - 1].days as { date: string; count: number; level: ContributionLevel }[]).push({ date, count, level });
  });
  return weeks;
}

// 8 weeks from Sun 2025-12-21; last week has 3 days (Feb 8–10, 2026).
const counts = Array.from({ length: 52 }, () => 0);
counts[2] = 5; // Dec 23
counts[20] = 9; // Jan 10 (tie)
counts[30] = 9; // Jan 20 (tie, later)
counts[51] = 1; // Feb 10
const fixture = weeksFrom("2025-12-21", counts);

describe("contribution helpers", () => {
  it("formats UTC dates", () => {
    expect(formatDate("2025-09-14")).toBe("Sep 14, 2025");
  });

  it("summarizes totals, active days and the earliest busiest day", () => {
    expect(fixture).toHaveLength(8);
    expect(fixture[7].days).toHaveLength(3);
    expect(summarize(fixture)).toEqual({
      start: "2025-12-21",
      end: "2026-02-10",
      total: 24,
      activeDays: 4,
      busiest: { count: 9, date: "2026-01-10" },
    });
    expect(summarize([])).toBeNull();
  });

  it("labels months per the design rule, with the year on January", () => {
    // Dec (col 1) is replaced by Jan (col 3, under 3 columns away); Feb at col 7 has only 2 weeks left, so it is dropped.
    expect(monthLabels(fixture)).toEqual([{ label: "Jan ’26", column: 3, span: 3 }]);
  });

  it("labels each month at the week of its first Sunday", () => {
    // Sundays: Aug 10 (col 1) ... Aug 31 (col 4, still Aug), Sep 7 (col 5), Oct 5 (col 9); Nov 2 (col 13) is the last week, dropped.
    const weeks = weeksFrom("2025-08-10", Array.from({ length: 7 * 13 }, () => 0));
    expect(monthLabels(weeks).map((m) => [m.label, m.column, m.span])).toEqual([
      ["Aug", 1, 3],
      ["Sep", 5, 3],
      ["Oct", 9, 3],
    ]);
  });

  it("pads the first week by its UTC weekday and keeps column order", () => {
    const weeks: ContributionWeek[] = [{ days: [{ date: "2026-01-07", count: 2, level: 2 }] }]; // Wednesday
    const cells = gridCells(weeks);
    expect(cells.slice(0, 3).every((cell) => cell.kind === "pad")).toBe(true);
    expect(cells[3]).toEqual({ kind: "day", day: weeks[0].days[0], level: 2 });
    expect(gridCells(fixture)).toHaveLength(52);
  });

  it("writes tooltip text", () => {
    expect(cellTitle({ date: "2026-09-08", count: 6, level: 3 })).toBe("6 contributions on Sep 8, 2026");
    expect(cellTitle({ date: "2026-09-08", count: 1, level: 1 })).toBe("1 contribution on Sep 8, 2026");
    expect(cellTitle({ date: "2026-09-08", count: 0, level: 0 })).toBe("No contributions on Sep 8, 2026");
  });

  it("takes the last N weeks", () => {
    expect(lastWeeks(fixture, 2).map((week) => week.days[0].date)).toEqual(["2026-02-01", "2026-02-08"]);
  });
});
