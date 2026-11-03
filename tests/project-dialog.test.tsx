import { axe } from "jest-axe";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDialog, useProjectDialog } from "@/components/ProjectDialog";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";

function Harness({ items, showAllProjectsLink = false }: { items: readonly Project[]; showAllProjectsLink?: boolean }) {
  const dialog = useProjectDialog();
  return (
    <>
      {items.map((project, i) => (
        <ProjectCard key={project.id} project={project} variant="grid" onOpen={(trigger) => dialog.open(i, trigger)} />
      ))}
      <ProjectDialog
        items={items}
        index={dialog.index}
        onIndexChange={dialog.setIndex}
        onClose={dialog.onClose}
        showAllProjectsLink={showAllProjectsLink}
      />
    </>
  );
}

const dialogEl = () => document.querySelector("dialog") as HTMLDialogElement;

/** Browser behavior for Escape on a modal dialog: "cancel", then close unless prevented. */
function pressEscape(dialog: HTMLDialogElement) {
  const cancel = new Event("cancel", { cancelable: true });
  dialog.dispatchEvent(cancel);
  if (!cancel.defaultPrevented) dialog.close();
}

describe("ProjectDialog", () => {
  it("opens from a card, labels itself by the title and focuses close", () => {
    render(<Harness items={projects} />);

    const card = screen.getByRole("button", { name: projects[0].title });
    expect(card).toHaveAttribute("aria-haspopup", "dialog");
    fireEvent.click(card);

    const dialog = screen.getByRole("dialog", { name: projects[0].title });
    expect(dialog).toHaveAttribute("open");
    expect(within(dialog).getByRole("heading", { level: 2 })).toHaveTextContent(projects[0].title);
    expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    expect(within(dialog).getByText("01 / 11")).toBeInTheDocument();
    expect(within(dialog).getAllByRole("listitem", { hidden: false }).length).toBeGreaterThan(0);
  });

  it("closes on Escape and returns focus to the card", () => {
    render(<Harness items={projects} />);
    const card = screen.getByRole("button", { name: projects[2].title });
    fireEvent.click(card);

    pressEscape(dialogEl());

    expect(dialogEl()).not.toHaveAttribute("open");
    expect(card).toHaveFocus();
  });

  it("closes from the close button and from a backdrop click, not from a panel click", () => {
    render(<Harness items={projects} />);
    const card = screen.getByRole("button", { name: projects[1].title });

    fireEvent.click(card);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(dialogEl()).not.toHaveAttribute("open");
    expect(card).toHaveFocus();

    fireEvent.click(card);
    fireEvent.click(screen.getByRole("heading", { level: 2 }));
    expect(dialogEl()).toHaveAttribute("open");
    fireEvent.click(dialogEl());
    expect(dialogEl()).not.toHaveAttribute("open");
  });

  it("wraps Previous and Next and keeps original numbers", () => {
    const featured = projects.filter((project) => project.featured);
    render(<Harness items={featured} showAllProjectsLink />);

    fireEvent.click(screen.getByRole("button", { name: featured[0].title }));
    const dialog = () => screen.getByRole("dialog");

    fireEvent.click(within(dialog()).getByRole("button", { name: "Previous project" }));
    expect(dialog()).toHaveAccessibleName(featured[2].title);
    expect(within(dialog()).getByText("03 / 11")).toBeInTheDocument();

    fireEvent.click(within(dialog()).getByRole("button", { name: "Next project" }));
    fireEvent.click(within(dialog()).getByRole("button", { name: "Next project" }));
    expect(dialog()).toHaveAccessibleName(featured[1].title);
    expect(within(dialog()).getByRole("link", { name: "All projects" })).toHaveAttribute("href", "/projects");
  });

  it("shows the GitHub link only when the project has one", () => {
    render(<Harness items={projects} />);

    fireEvent.click(screen.getByRole("button", { name: "pi-extensions" }));
    const link = within(screen.getByRole("dialog")).getByRole("link", { name: /View on GitHub/ });
    expect(link).toHaveAttribute("href", "https://github.com/petergabriel-dev/pi-extensions");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");

    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Next project" }));
    expect(within(screen.getByRole("dialog")).queryByRole("link", { name: /View on GitHub/ })).not.toBeInTheDocument();
  });

  it("lists technologies as non-interactive items", () => {
    render(<Harness items={projects} />);
    fireEvent.click(screen.getByRole("button", { name: projects[0].title }));

    const tags = within(screen.getByRole("dialog")).getByRole("list", { name: "Technologies" });
    expect(within(tags).getAllByRole("listitem").map((item) => item.textContent)).toEqual([...projects[0].tags]);
  });

  it("has no axe violations with the dialog open", async () => {
    const { container } = render(<Harness items={projects} />);
    fireEvent.click(screen.getByRole("button", { name: projects[1].title }));

    expect((await axe(container)).violations).toEqual([]);
  });
});
