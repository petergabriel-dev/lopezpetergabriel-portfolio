import { axe } from "jest-axe";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RepoList } from "@/components/RepoList";
import { ProjectsView } from "@/components/views/ProjectsView";
import { githubSnapshot } from "@/content/github";
import { formatProjectNumber, projects } from "@/content/projects";
import type { GithubRepo } from "@/content/types";

const renderView = () => render(<ProjectsView projects={projects} snapshot={githubSnapshot} />);

describe("Projects route view", () => {
  it("shows the hero with a count from the data", () => {
    renderView();

    expect(screen.getByRole("heading", { level: 1, name: "What I've built" })).toBeInTheDocument();
    expect(screen.getByText(`Projects · ${projects.length} builds`)).toBeInTheDocument();
  });

  it("labels filters with counts from the data and toggles aria-pressed", () => {
    renderView();

    const group = screen.getByRole("group", { name: "Filter projects" });
    const filters = within(group).getAllByRole("button");
    const count = (category: string) => projects.filter((project) => project.category === category).length;
    expect(filters.map((button) => button.textContent)).toEqual([
      `All ${projects.length}`,
      `Work ${count("Work")}`,
      `Independent ${count("Independent")}`,
      `Academic ${count("Academic")}`,
    ]);
    expect(filters.map((button) => button.getAttribute("aria-pressed"))).toEqual(["true", "false", "false", "false"]);

    fireEvent.click(filters[3]);
    expect(filters[3]).toHaveAttribute("aria-pressed", "true");
    expect(filters[0]).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps original numbers when filtering and opens the dialog at that number", () => {
    renderView();

    fireEvent.click(screen.getByRole("button", { name: /^Academic/ }));
    const cards = screen.getAllByRole("button", { name: /Dynamic Image Protection API|Dog Breed Identifier/ });
    expect(cards).toHaveLength(2);
    expect(cards.map((card) => card.textContent?.slice(0, 2))).toEqual(["10", "11"]);

    fireEvent.click(cards[0]);
    expect(within(screen.getByRole("dialog")).getByText("10 / 11")).toBeInTheDocument();
  });

  it("numbers projects by id, so serialized copies from the server keep their number", () => {
    const copy = structuredClone(projects[9]);
    expect(copy).not.toBe(projects[9]);
    expect(formatProjectNumber(copy)).toBe("10");

    render(<ProjectsView projects={structuredClone(projects)} snapshot={githubSnapshot} />);
    expect(screen.getByRole("button", { name: projects[10].title }).textContent?.slice(0, 2)).toBe("11");
  });

  it("lists six recent repositories with protected links", () => {
    renderView();

    const repos = screen.getByRole("complementary", { name: "Recently pushed on GitHub" });
    expect(within(repos).getAllByRole("listitem")).toHaveLength(6);
    for (const link of within(repos).getAllByRole("link")) {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("omits a missing language and renders absolute UTC dates", () => {
    const repo: GithubRepo = {
      name: "no-language",
      description: null,
      language: null,
      stars: 0,
      pushedAt: "2026-06-19T04:32:27Z",
      url: "https://github.com/petergabriel-dev/no-language",
    };
    render(<RepoList repos={[repo]} profileUrl={githubSnapshot.profileUrl} />);

    expect(screen.getByRole("link", { name: "no-language Jun 19" })).toBeInTheDocument();
  });

  it("shows an empty state without repositories", () => {
    render(<RepoList repos={[]} profileUrl={githubSnapshot.profileUrl} />);

    expect(screen.getByText("No public repositories yet")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderView();

    expect((await axe(container)).violations).toEqual([]);
  });
});
