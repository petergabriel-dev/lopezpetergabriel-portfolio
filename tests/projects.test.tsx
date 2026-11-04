import { axe } from "jest-axe";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCard } from "@/components/ProjectCard";
import { RepoList } from "@/components/RepoList";
import { ProjectsView } from "@/components/views/ProjectsView";
import { githubSnapshot } from "@/content/github";
import { formatProjectNumber, projects } from "@/content/projects";
import type { GithubRepo } from "@/content/types";

const renderView = () => render(<ProjectsView projects={projects} snapshot={githubSnapshot} />);
const featured = projects.filter((project) => project.featured);
const moreButton = () => screen.getByRole("button", { name: `More projects ${projects.length - featured.length}` });
const listDialog = () => screen.getByRole("dialog", { name: /^All projects/ });
const openList = () => {
  fireEvent.click(moreButton());
  return listDialog();
};

/** Browser behavior for Escape on a modal dialog: "cancel", then close unless prevented. In act() so the
 *  state set by the "close" listener is flushed before the next interaction, as a real browser would. */
function pressEscape(dialog: HTMLElement) {
  act(() => {
    const cancel = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancel);
    if (!cancel.defaultPrevented) (dialog as HTMLDialogElement).close();
  });
}

describe("Projects route view", () => {
  it("shows the hero with a count from the data", () => {
    renderView();

    expect(screen.getByRole("heading", { level: 1, name: "What I've built" })).toBeInTheDocument();
    expect(screen.getByText(`Projects · ${projects.length} builds`)).toBeInTheDocument();
  });

  it("shows only the featured cards and a More projects button, with no filters on the page", () => {
    renderView();

    const cards = screen.getAllByRole("button", { name: new RegExp(featured.map((project) => project.title).join("|")) });
    expect(cards.map((card) => card.textContent?.slice(0, 2))).toEqual(["01", "02", "03"]);
    expect(screen.queryByRole("button", { name: projects[3].title })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Filter projects" })).not.toBeInTheDocument();
    expect(moreButton()).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("opens the All projects list focused on close, with counted filters and every project", () => {
    renderView();
    const list = openList();

    expect(list).toHaveAttribute("open");
    expect(within(list).getByRole("button", { name: "Close" })).toHaveFocus();
    const group = within(list).getByRole("group", { name: "Filter projects" });
    const filters = within(group).getAllByRole("button");
    const count = (category: string) => projects.filter((project) => project.category === category).length;
    expect(filters.map((button) => button.textContent)).toEqual([
      `All ${projects.length}`,
      `Work ${count("Work")}`,
      `Independent ${count("Independent")}`,
      `Academic ${count("Academic")}`,
    ]);
    expect(filters.map((button) => button.getAttribute("aria-pressed"))).toEqual(["true", "false", "false", "false"]);
    expect(within(list).getAllByRole("listitem")).toHaveLength(projects.length);

    fireEvent.click(filters[3]);
    expect(filters[3]).toHaveAttribute("aria-pressed", "true");
    expect(filters[0]).toHaveAttribute("aria-pressed", "false");
  });

  it("filters rows with original numbers and stacks the project dialog above the list", () => {
    renderView();
    const list = openList();

    fireEvent.click(within(list).getByRole("button", { name: /^Academic/ }));
    const rows = within(list).getAllByRole("button", { name: /Dynamic Image Protection API|Dog Breed Identifier/ });
    expect(rows.map((row) => row.textContent?.slice(0, 2))).toEqual(["10", "11"]);

    fireEvent.click(rows[0]);
    const detail = screen.getByRole("dialog", { name: "Dynamic Image Protection API" });
    expect(within(detail).getByText("10 / 11")).toBeInTheDocument();
    expect(list).toHaveAttribute("open");

    pressEscape(detail);
    expect(detail).not.toHaveAttribute("open");
    expect(list).toHaveAttribute("open");
    expect(rows[0]).toHaveFocus();
    expect(within(list).getByRole("button", { name: /^Academic/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("closes the list from close, Escape and a backdrop click, returning focus to More projects", () => {
    renderView();

    fireEvent.click(within(openList()).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog", { name: /^All projects/ })).not.toBeInTheDocument();
    expect(moreButton()).toHaveFocus();

    pressEscape(openList());
    expect(screen.queryByRole("dialog", { name: /^All projects/ })).not.toBeInTheDocument();
    expect(moreButton()).toHaveFocus();

    const list = openList();
    fireEvent.click(within(list).getByRole("heading", { level: 2 }));
    expect(list).toHaveAttribute("open");
    fireEvent.click(list);
    expect(list).not.toHaveAttribute("open");
    expect(moreButton()).toHaveFocus();
  });

  it("numbers projects by id, so serialized copies from the server keep their number", () => {
    const copy = structuredClone(projects[9]);
    expect(copy).not.toBe(projects[9]);
    expect(formatProjectNumber(copy)).toBe("10");

    render(<ProjectsView projects={structuredClone(projects)} snapshot={githubSnapshot} />);
    const list = openList();
    expect(within(list).getByRole("button", { name: projects[10].title }).textContent?.slice(0, 2)).toBe("11");
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

  it("has no axe violations with the list open, and with the project dialog stacked on it", async () => {
    const { container } = renderView();
    const list = openList();
    expect((await axe(container)).violations).toEqual([]);

    fireEvent.click(within(list).getByRole("button", { name: projects[4].title }));
    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("ProjectCard row variant", () => {
  it("renders the compact row as a dialog trigger with its own title id", () => {
    const project = projects[4];
    let opened: HTMLButtonElement | null = null;
    render(<ProjectCard project={project} variant="row" onOpen={(trigger) => (opened = trigger)} />);

    const row = screen.getByRole("button", { name: project.title });
    expect(row).toHaveAttribute("aria-haspopup", "dialog");
    expect(row).toHaveAttribute("aria-labelledby", `row-${project.id}-title`);
    expect(within(row).getByText(`${project.category} · ${project.period}`)).toBeInTheDocument();
    expect(row.textContent?.slice(0, 2)).toBe("05");

    fireEvent.click(row);
    expect(opened).toBe(row);
  });
});
