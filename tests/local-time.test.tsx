import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LocalTimeCard } from "@/components/LocalTimeCard";

beforeEach(() => {
  vi.useFakeTimers();
  // 06:05 UTC = 14:05 Tuesday in Asia/Manila (UTC+8).
  vi.setSystemTime(new Date("2026-11-03T06:05:30Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("LocalTimeCard", () => {
  it("renders a stable placeholder on the server", () => {
    const html = renderToString(<LocalTimeCard detail="availability" />);

    expect(html).toContain("--:--");
    expect(html).not.toContain("14:05");
    expect(html).not.toContain("Tuesday");
  });

  it("shows Manila time and weekday on the client", () => {
    render(<LocalTimeCard detail="availability" />);

    expect(screen.getByText("14:05")).toHaveAttribute("datetime", "2026-11-03T06:05:00.000Z");
    expect(screen.getByText("Tuesday · Peter's local time")).toBeInTheDocument();
    expect(screen.getByText("UTC+8")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Available",
      "Contract",
      "Across timezones",
    ]);
  });

  it("refreshes on the 15 second poll and clears it on unmount", () => {
    const { unmount } = render(<LocalTimeCard detail="languages" />);
    expect(screen.getByText("English · Filipino · Hiligaynon")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(45_000);
    });
    expect(screen.getByText("14:06")).toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
