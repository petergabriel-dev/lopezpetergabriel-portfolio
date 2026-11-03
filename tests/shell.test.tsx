import { axe } from "jest-axe";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "@/components/AppShell";

const pathname = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

function renderShell(path: string) {
  pathname.current = path;
  return render(
    <AppShell>
      <h1>Page</h1>
    </AppShell>,
  );
}

describe("AppShell and SectionNav", () => {
  it.each([
    ["/", "About"],
    ["/projects", "Projects"],
    ["/experience", "Experience"],
    ["/contact", "Contact"],
  ])("marks only the current section for %s", (path, name) => {
    renderShell(path);

    const nav = screen.getByRole("navigation", { name: "Sections" });
    const current = within(nav)
      .getAllByRole("link", { hidden: true })
      .filter((link) => link.getAttribute("aria-current") === "page");

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName(name);
  });

  it("keeps sections in order", () => {
    renderShell("/");

    const nav = screen.getByRole("navigation", { name: "Sections" });
    const names = within(nav)
      .getAllByRole("link", { hidden: true })
      .map((link) => link.getAttribute("aria-label") ?? link.textContent);

    expect(names).toEqual([
      "Peter Gabriel Lopez — About",
      "About",
      "Projects",
      "Experience",
      "Contact",
      "Download résumé (PDF)",
    ]);
  });

  it("provides a skip link to the main landmark", () => {
    renderShell("/");

    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "content");
    expect(screen.getAllByRole("banner")).toHaveLength(1);
  });

  it("downloads the real résumé and protects external links", () => {
    const { container } = renderShell("/");

    // Rail (desktop) and header (desktop) résumé links; both are display:none in jsdom's mobile view.
    const resumeLinks = container.querySelectorAll('a[href="/resume.pdf"]');
    expect(resumeLinks).toHaveLength(2);
    for (const link of resumeLinks) {
      expect(link).toHaveAttribute("href", "/resume.pdf");
      expect(link).toHaveAttribute("download");
    }

    expect(screen.getByRole("link", { name: "GitHub profile", hidden: true })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: "Email Peter", hidden: true })).toHaveAttribute(
      "href",
      "mailto:lopezpetergabriel@gmail.com",
    );
    expect(screen.getByRole("img", { name: "Peter Gabriel Lopez" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderShell("/projects");

    expect((await axe(container)).violations).toEqual([]);
  });
});
