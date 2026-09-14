import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { App } from "./App";

function renderApp(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App", () => {
  it("renders a directly requested primary destination", () => {
    renderApp("/metrics");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Metrics",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Metrics",
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("presents the five primary navigation destinations", () => {
    renderApp();

    const destinations = [
      "Home",
      "Metrics",
      "Workouts",
      "Nutrition",
      "AI Chat",
    ];

    for (const destination of destinations) {
      expect(
        screen.getByRole("link", {
          name: destination,
        }),
      ).toBeInTheDocument();
    }
  });

  it("navigates to another primary destination", async () => {
    const user = userEvent.setup();

    renderApp();

    const workoutsLink = screen.getByRole("link", {
      name: "Workouts",
    });

    await user.click(workoutsLink);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Workouts",
      }),
    ).toBeInTheDocument();

    expect(workoutsLink).toHaveAttribute("aria-current", "page");
  });
});