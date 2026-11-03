import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { githubSnapshot } from "@/content/github";
import { ContributionGrid } from "@/components/ContributionGrid";
import { RepoList } from "@/components/RepoList";
import { TagChip } from "@/components/TagChip";
import { formatDate, lastWeeks, summarize } from "@/lib/contributions";

describe("GitHub components", () => {
  it("protects repository and profile links", () => {
    render(<RepoList profileUrl={githubSnapshot.profileUrl} repos={githubSnapshot.repos} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(Math.min(6, githubSnapshot.repos.length));
    for (const repo of githubSnapshot.repos.slice(0, 6)) {
      const link = screen.getByRole("link", { name: new RegExp(`^${repo.name} `) });
      expect(link).toHaveAttribute("href", repo.url);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    const profileLink = screen.getByRole("link", { name: "Profile" });
    expect(profileLink).toHaveAttribute("href", githubSnapshot.profileUrl);
    expect(profileLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(document.body.textContent).not.toMatch(/\bago\b/i);
  });

  it("captions the year grid with totals derived from the snapshot", () => {
    const { weeks, total } = githubSnapshot.contributions;
    const summary = summarize(weeks)!;
    const { container } = render(<ContributionGrid weeks={weeks} total={total} variant="year" />);

    const figure = screen.getByRole("figure");
    expect(figure.querySelector("figcaption")?.textContent).toBe(
      `GitHub contributions · ${formatDate(summary.start)} – ${formatDate(summary.end)} ${total} in the past year · ${summary.activeDays} active days`,
    );
    expect(figure).toHaveTextContent(
      `Busiest day: ${summary.busiest.count} on ${formatDate(summary.busiest.date)}`,
    );
    expect(container.querySelectorAll("[title]")).toHaveLength(weeks.flatMap((week) => week.days).length);
  });

  it("captions the recent grid with the last 26 weeks", () => {
    const { weeks, total } = githubSnapshot.contributions;
    const recent = summarize(lastWeeks(weeks, 26))!;
    render(<ContributionGrid weeks={weeks} total={total} variant="recent" />);

    expect(screen.getByRole("figure").querySelector("figcaption")?.textContent).toBe(
      `GitHub contributions · last 26 weeks ${recent.total} since ${formatDate(recent.start)} · ${total} in the past year`,
    );
  });

  it("has no axe violations", async () => {
    const { weeks, total } = githubSnapshot.contributions;
    const { container } = render(
      <>
        <ContributionGrid weeks={weeks} total={total} variant="year" />
        <ContributionGrid weeks={weeks} total={total} variant="recent" />
        <RepoList profileUrl={githubSnapshot.profileUrl} repos={githubSnapshot.repos} />
      </>,
    );

    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("TagChip", () => {
  it("renders a noninteractive list item", () => {
    render(
      <ul>
        <TagChip label="Go" />
      </ul>,
    );

    expect(screen.getByRole("listitem")).toHaveTextContent("Go");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
