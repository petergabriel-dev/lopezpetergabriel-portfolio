import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { githubSnapshot } from "@/content/github";
import { ContributionGrid } from "@/components/ContributionGrid";
import { RepoList } from "@/components/RepoList";
import { TagChip } from "@/components/TagChip";

describe("GitHub components", () => {
  it("protects repository and profile links", () => {
    render(<RepoList profileUrl={githubSnapshot.profileUrl} repos={githubSnapshot.repos} />);

    for (const repo of githubSnapshot.repos) {
      expect(screen.getByRole("link", { name: repo.name })).toHaveAttribute("rel", "noopener noreferrer");
    }

    const profileLink = screen.getByRole("link", { name: /View all repositories/ });
    expect(profileLink).toHaveAttribute("href", githubSnapshot.profileUrl);
    expect(profileLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(document.body.textContent).not.toMatch(/\bago\b/i);
  });

  it("exposes the contribution total from the snapshot", () => {
    render(<ContributionGrid contributions={githubSnapshot.contributions} />);

    expect(
      screen.getByRole("img", { name: `${githubSnapshot.contributions.total} contributions in the last year` }),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <ContributionGrid contributions={githubSnapshot.contributions} />
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
