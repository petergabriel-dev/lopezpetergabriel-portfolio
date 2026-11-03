import { axe } from "jest-axe";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeView } from "@/components/views/HomeView";
import { githubSnapshot } from "@/content/github";
import { projects } from "@/content/projects";

const featured = projects.filter((project) => project.featured);
const renderHome = () =>
  render(<HomeView snapshot={githubSnapshot} featured={featured} projectCount={projects.length} />);

describe("Home route view", () => {
  it("renders one h1 with the headline and the mobile CTAs", () => {
    renderHome();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Useful systems over noisy demos.");
    expect(screen.getByRole("link", { name: "Email Peter" })).toHaveAttribute("href", "mailto:lopezpetergabriel@gmail.com");
    const resume = screen.getByRole("link", { name: "Download résumé (PDF)" });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download");
  });

  it("renders both grid variants from the snapshot", () => {
    const { container } = renderHome();

    // The year grid is display:none in jsdom's mobile view, so query by selector.
    const captions = [...container.querySelectorAll("figure")].map((figure) => figure.querySelector("figcaption")?.textContent);
    expect(captions).toHaveLength(2);
    expect(captions[0]).toContain(`${githubSnapshot.contributions.total} in the past year`);
    expect(captions[1]).toContain("last 26 weeks");
  });

  it("links to all projects with a count from the data", () => {
    renderHome();

    expect(screen.getByRole("link", { name: `All ${projects.length} projects` })).toHaveAttribute("href", "/projects");
  });

  it("opens featured work in the dialog and cycles only the featured three", () => {
    renderHome();

    const selected = screen.getByRole("region", { name: "Selected work" });
    const cards = within(selected).getAllByRole("button");
    expect(cards.map((card) => card.textContent?.includes(featured[cards.indexOf(card)].title))).toEqual([true, true, true]);

    fireEvent.click(cards[0]);
    const dialog = () => screen.getByRole("dialog");
    expect(within(dialog()).getByText("01 / 11")).toBeInTheDocument();
    expect(within(dialog()).getByRole("link", { name: "All projects" })).toHaveAttribute("href", "/projects");

    const next = () => within(dialog()).getByRole("button", { name: "Next project" });
    fireEvent.click(next());
    expect(dialog()).toHaveAccessibleName(featured[1].title);
    fireEvent.click(next());
    fireEvent.click(next());
    expect(dialog()).toHaveAccessibleName(featured[0].title);
  });

  it("has no axe violations", async () => {
    const { container } = renderHome();

    expect((await axe(container)).violations).toEqual([]);
  });
});
