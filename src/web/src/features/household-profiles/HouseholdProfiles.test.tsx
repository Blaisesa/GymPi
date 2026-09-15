import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HouseholdProfiles } from "./HouseholdProfiles";
import * as profileClient from "./profileClient";

vi.mock("./profileClient");

const firstProfile: profileClient.HouseholdProfile = {
  id: "2e6a67ff-6e09-46a1-87ec-cf674a3ccbc4",
  displayName: "Blaise",
  timeZoneId: "Europe/Dublin",
  dailyHydrationGoalMl: 2500,
  createdAtUtc: "2026-09-15T10:00:00Z",
};

const secondProfile: profileClient.HouseholdProfile = {
  id: "b9c4fc26-52cd-4f42-9ad8-a891389e42ce",
  displayName: "Alex",
  timeZoneId: "America/New_York",
  dailyHydrationGoalMl: 2200,
  createdAtUtc: "2026-09-15T10:01:00Z",
};

beforeEach(() => {
  localStorage.clear();
  vi.mocked(profileClient.listProfiles).mockReset();
  vi.mocked(profileClient.createProfile).mockReset();
});

describe("HouseholdProfiles", () => {
  it("creates and selects the first household profile", async () => {
    const user = userEvent.setup();
    vi.mocked(profileClient.listProfiles).mockResolvedValue([]);
    vi.mocked(profileClient.createProfile).mockResolvedValue(firstProfile);

    render(<HouseholdProfiles />);

    await user.type(
      await screen.findByRole("textbox", { name: "Display name" }),
      "Blaise",
    );
    await user.clear(screen.getByRole("textbox", { name: "Time zone" }));
    await user.type(
      screen.getByRole("textbox", { name: "Time zone" }),
      "Europe/Dublin",
    );
    await user.clear(
      screen.getByRole("spinbutton", { name: "Daily hydration goal" }),
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Daily hydration goal" }),
      "2500",
    );
    await user.click(screen.getByRole("button", { name: "Create profile" }));

    expect(profileClient.createProfile).toHaveBeenCalledWith(
      {
        displayName: "Blaise",
        timeZoneId: "Europe/Dublin",
        dailyHydrationGoalMl: 2500,
      },
      expect.any(AbortSignal),
    );
    expect(await screen.findByText("Blaise")).toBeInTheDocument();
    expect(localStorage.getItem("gympi.activeProfileId")).toBe(firstProfile.id);
  });

  it("selects an existing household profile", async () => {
    const user = userEvent.setup();
    vi.mocked(profileClient.listProfiles).mockResolvedValue([
      firstProfile,
      secondProfile,
    ]);

    render(<HouseholdProfiles />);

    const selector = await screen.findByRole("combobox", {
      name: "Active profile",
    });
    await user.selectOptions(selector, secondProfile.id);

    expect(selector).toHaveValue(secondProfile.id);
    expect(localStorage.getItem("gympi.activeProfileId")).toBe(secondProfile.id);
    expect(
      screen.getByText((content) => content.replace(/\D/g, "") === "2200"),
    ).toBeInTheDocument();
  });
});
