import { axe } from "jest-axe";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactView } from "@/components/views/ContactView";

describe("Contact route view", () => {
  it("renders the hero with the availability chip and CTAs", () => {
    render(<ContactView />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Open a conversation");
    expect(screen.getByText("Available for contract work")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email Peter" })).toHaveAttribute("href", "mailto:lopezpetergabriel@gmail.com");
    const resume = screen.getByRole("link", { name: "Download résumé (PDF)" });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download");
  });

  it("lists the four direct lines with real links", () => {
    render(<ContactView />);

    const lines = screen.getByRole("region", { name: "Direct lines" });
    const email = within(lines).getByRole("link", { name: /^Email lopezpetergabriel@gmail\.com$/ });
    expect(email).toHaveAttribute("href", "mailto:lopezpetergabriel@gmail.com");

    const phone = within(lines).getByRole("link", { name: /\+63 976 126 0783/ });
    expect(phone).toHaveAttribute("href", "tel:+639761260783");
    expect(phone).toHaveAccessibleName(/^Phone/);

    const linkedin = within(lines).getByRole("link", { name: /^LinkedIn/ });
    expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/in/peter-gabriel-lopez-702646393");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");

    const github = within(lines).getByRole("link", { name: /^GitHub/ });
    expect(github).toHaveAttribute("href", "https://github.com/petergabriel-dev");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");

    expect(within(lines).getAllByRole("link")).toHaveLength(4);
  });

  it("shows the three topics and the languages time card", () => {
    render(<ContactView />);

    const topics = screen.getByRole("region", { name: "Good things to write about" });
    expect(within(topics).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("English · Filipino · Hiligaynon")).toBeInTheDocument();
  });

  it("has no contact form", () => {
    const { container } = render(<ContactView />);

    expect(container.querySelector("form, input, textarea")).toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ContactView />);

    expect((await axe(container)).violations).toEqual([]);
  });
});
