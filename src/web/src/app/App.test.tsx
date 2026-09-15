import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";

import { App } from "./App";

function renderApp(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

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

  it("renders the dedicated hydration page", () => {
    renderApp("/hydration");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Hydration",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Choose a household profile first.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Choose profile" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("opens hydration from the Home dashboard", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("link", { name: "Track hydration" }));

    expect(
      screen.getByRole("heading", { level: 1, name: "Hydration" }),
    ).toBeInTheDocument();
  });
});
