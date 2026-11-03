import { statSync } from "node:fs";
import { join } from "node:path";

import { axe } from "jest-axe";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExperienceView } from "@/components/views/ExperienceView";
import { education, roles, toolkit } from "@/content/experience";
import { getResumeSizeLabel } from "@/lib/resume";

const resumeSize = getResumeSizeLabel();
const renderView = () => render(<ExperienceView resumeSize={resumeSize} />);

describe("Experience route view", () => {
  it("computes the résumé size from public/resume.pdf", () => {
    const kb = Math.round(statSync(join(process.cwd(), "public", "resume.pdf")).size / 1024);
    expect(resumeSize).toBe(`PDF · ${kb} KB`);
    expect(() => getResumeSizeLabel("/nonexistent")).toThrow();
  });

  it("renders the hero, DILG highlights and the résumé download", () => {
    renderView();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Data Analyst at DILG Region VI");
    expect(within(screen.getByRole("list", { name: "At DILG Region VI" })).getAllByRole("listitem")).toHaveLength(3);
    const resume = screen.getByRole("link", { name: `Download full résumé (PDF, ${resumeSize.replace("PDF · ", "")})` });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download");
  });

  it("lists the four toolkit areas without a subtitle", () => {
    renderView();

    const section = screen.getByRole("region", { name: "Toolkit" });
    expect(within(section).getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(
      toolkit.map((area) => area.area),
    );
    expect(section).not.toHaveTextContent("By area");
    for (const area of toolkit) expect(section).toHaveTextContent(area.usedAt);
  });

  it("shows five roles in order and the education honors", () => {
    const { container } = renderView();

    // Desktop cards are display:none in jsdom's mobile view; read them from the DOM.
    const cards = container.querySelector('section[aria-labelledby="roles-title"]')!;
    expect([...cards.querySelectorAll("li")].map((li) => li.textContent)).toEqual(
      roles.map((role) => `${role.kind ? `${role.kind} · ` : ""}${role.location}${role.title}${role.org}${role.year}${role.range}`),
    );
    const honors = container.querySelector('ul[aria-label="Honors"]')!;
    expect([...honors.querySelectorAll("li")].map((li) => li.textContent)).toEqual([...education.honors]);
    expect(education.honors).toEqual(["TOPCIT Passer · 2025", "Dean's Lister · AY 2021–22"]);
  });

  it("renders the mobile timeline from Now to education", () => {
    renderView();

    const steps = [...screen.getByRole("list", { name: "Timeline" }).children];
    expect(steps).toHaveLength(roles.length + 2);
    expect(steps[0]).toHaveTextContent("Now");
    expect(steps[1]).toHaveTextContent(roles[0].title);
    expect(steps.at(-1)).toHaveTextContent(education.degree);
  });

  it("has no axe violations", async () => {
    const { container } = renderView();

    expect((await axe(container)).violations).toEqual([]);
  });
});
