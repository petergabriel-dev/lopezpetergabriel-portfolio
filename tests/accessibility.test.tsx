import { axe } from "jest-axe";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { githubSnapshot } from "@/content/github";
import { projects } from "@/content/projects";
import { AboutPanel } from "@/components/panels/AboutPanel";
import { ContactPanel } from "@/components/panels/ContactPanel";
import { ExperiencePanel } from "@/components/panels/ExperiencePanel";
import { ProjectsPanel } from "@/components/panels/ProjectsPanel";
import { EditorTabBar, type EditorTab } from "@/components/EditorTabBar";
import { StatusBar } from "@/components/StatusBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TypingHeadline } from "@/components/TypingHeadline";

const tabs: readonly EditorTab[] = [
  { id: "about", label: "about.md" },
  { id: "projects", label: "projects.tsx" },
  { id: "experience", label: "experience.json" },
  { id: "contact", label: "contact.md" },
];

function renderTabs() {
  return render(
    <EditorTabBar tabs={tabs}>
      <p>About panel</p>
      <p>Projects panel</p>
      <p>Experience panel</p>
      <p>Contact panel</p>
    </EditorTabBar>,
  );
}

describe("EditorTabBar", () => {
  it("renders four tabs in spec order with a roving tab sequence", () => {
    renderTabs();

    const renderedTabs = screen.getAllByRole("tab");

    expect(renderedTabs.map((tab) => tab.textContent)).toEqual([
      "about.md",
      "projects.tsx",
      "experience.json",
      "contact.md",
    ]);
    expect(renderedTabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(renderedTabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual([
      "true",
      "false",
      "false",
      "false",
    ]);

    for (const tab of renderedTabs) {
      const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
      expect(panel).toHaveAttribute("role", "tabpanel");
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    }
  });

  it("activates panels by click and keeps only active panel visible", () => {
    renderTabs();

    fireEvent.click(screen.getByRole("tab", { name: "projects.tsx" }));

    expect(screen.getByRole("tab", { name: "projects.tsx" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Projects panel");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "projects-panel");
  });

  it("resets active panel scroll position when switching tabs", () => {
    renderTabs();

    const aboutPanel = screen.getByRole("tabpanel");
    aboutPanel.scrollTop = 120;

    fireEvent.click(screen.getByRole("tab", { name: "projects.tsx" }));
    fireEvent.click(screen.getByRole("tab", { name: "about.md" }));

    expect(screen.getByRole("tabpanel")).toBe(aboutPanel);
    expect(aboutPanel.scrollTop).toBe(0);
  });

  it("wraps arrow navigation in both directions and moves focus", () => {
    renderTabs();

    const renderedTabs = screen.getAllByRole("tab");
    renderedTabs[0].focus();
    fireEvent.keyDown(renderedTabs[0], { key: "ArrowLeft" });

    expect(document.activeElement).toBe(renderedTabs[3]);
    expect(renderedTabs[3]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(renderedTabs[3], { key: "ArrowRight" });

    expect(document.activeElement).toBe(renderedTabs[0]);
    expect(renderedTabs[0]).toHaveAttribute("aria-selected", "true");
  });
});

describe("accessibility contracts", () => {
  it("keeps LinkedIn as non-link text and protects GitHub", () => {
    render(<ContactPanel />);

    expect(screen.queryByRole("link", { name: /LinkedIn/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "github.com/petergabriel-dev" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("renders all project cards and GitHub accessibility contracts", () => {
    render(<ProjectsPanel />);

    expect(screen.getByRole("heading", { name: "What I've built", level: 2 })).toBeInTheDocument();

    for (const project of projects) {
      const heading = screen.getByRole("heading", { name: project.title, level: 3 });
      const card = heading.closest("article");

      expect(card).not.toBeNull();
      const technologies = within(card as HTMLElement).getByRole("list", { name: "Technologies" });

      expect(within(technologies).getAllByRole("listitem")).toHaveLength(project.tags.length);
    }

    for (const repo of githubSnapshot.repos) {
      expect(screen.getByRole("link", { name: repo.name })).toHaveAttribute("rel", "noopener noreferrer");
    }

    const profileLink = screen.getByRole("link", { name: /View all repositories/ });
    expect(profileLink).toHaveAttribute("href", githubSnapshot.profileUrl);
    expect(profileLink).toHaveAttribute("rel", "noopener noreferrer");

    const contributionGrid = screen.getByRole("img", {
      name: `${githubSnapshot.contributions.total} contributions in the last year`,
    });
    const firstRepo = screen.getByRole("link", { name: githubSnapshot.repos[0].name });
    expect(contributionGrid.compareDocumentPosition(firstRepo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(contributionGrid).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\bago\b/i);
  });

  it("gives resume download an action and file-type name", () => {
    render(<StatusBar availabilityLabel="available for contract work" />);

    const resume = screen.getByRole("link", { name: "Download resume PDF" });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download", "resume.pdf");
  });

  it("exposes the complete headline before typing settles", () => {
    const headline = "Peter Gabriel Lopez — Backend Engineer & AI Automation Specialist";

    render(<TypingHeadline text={headline} />);

    expect(screen.getByRole("heading", { name: headline })).toHaveAttribute("aria-label", headline);
  });

  it("exposes theme state through pressed state and accessible name", async () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);

    const toggle = await waitFor(() => screen.getByRole("button", { name: /dark theme enabled/i }));
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});

describe.each(["light", "dark"])("axe scan in %s theme", (theme) => {
  it.each([
    ["about", <AboutPanel key="about" />],
    ["projects", <ProjectsPanel key="projects" />],
    ["experience", <ExperiencePanel key="experience" />],
    ["contact", <ContactPanel key="contact" />],
  ])("has no violations for %s panel", async (_name, panel) => {
    const { container } = render(<div data-theme={theme}>{panel}</div>);

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
