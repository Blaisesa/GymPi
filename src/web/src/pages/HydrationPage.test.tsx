import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HydrationPage } from "./HydrationPage";
import { ActiveProfileProvider } from "../features/household-profiles/ActiveProfileProvider";
import * as waterDropSound from "../features/hydration/waterDropSound";

vi.mock("../features/hydration/waterDropSound");

const profileId = "2e6a67ff-6e09-46a1-87ec-cf674a3ccbc4";

const emptyOverview = {
  localDate: "2026-09-15",
  timeZoneId: "Europe/Dublin",
  goalMl: 2500,
  consumedMl: 0,
  remainingMl: 2500,
  entries: [],
};

const updatedOverview = {
  ...emptyOverview,
  consumedMl: 250,
  remainingMl: 2250,
  entries: [
    {
      id: "b9c4fc26-52cd-4f42-9ad8-a891389e42ce",
      amountMl: 250,
      consumedAtUtc: "2026-09-15T12:30:00Z",
    },
  ],
};

function jsonResponse(payload: unknown, status = 200) {
  return {
    json: vi.fn().mockResolvedValue(payload),
    ok: status >= 200 && status < 300,
    status,
  };
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("gympi.activeProfileId", profileId);
  vi.unstubAllGlobals();
  vi.mocked(waterDropSound.playWaterDrop).mockReset();
});

describe("HydrationPage", () => {
  it("shows the recorded drink count beside daily progress", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(updatedOverview)));
    render(
      <MemoryRouter>
        <ActiveProfileProvider><HydrationPage /></ActiveProfileProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText("1 drink recorded")).toBeInTheDocument();
  });

  it("records water and refreshes today's persisted progress", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(emptyOverview))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            id: "b9c4fc26-52cd-4f42-9ad8-a891389e42ce",
            amountMl: 250,
            consumedAtUtc: "2026-09-15T12:30:00Z",
          },
          201,
        ),
      )
      .mockResolvedValueOnce(jsonResponse(updatedOverview));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter>
        <ActiveProfileProvider>
          <HydrationPage />
        </ActiveProfileProvider>
      </MemoryRouter>,
    );

    const progress = await screen.findByRole("progressbar", {
      name: "Daily hydration",
    });
    expect(progress).toHaveAttribute("aria-valuenow", "0");

    await user.click(screen.getByRole("button", { name: "Add 250 ml" }));

    await waitFor(() => {
      expect(progress).toHaveAttribute("aria-valuenow", "10");
    });
    expect(screen.getByText(/250 of 2.?500 ml/)).toBeInTheDocument();

    const history = screen.getByRole("region", { name: "Today's history" });
    expect(within(history).getByText("250 ml")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(waterDropSound.playWaterDrop).toHaveBeenCalledOnce();
  });

  it("lets the user mute water sounds", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(emptyOverview)));

    render(
      <MemoryRouter>
        <ActiveProfileProvider>
          <HydrationPage />
        </ActiveProfileProvider>
      </MemoryRouter>,
    );

    await user.click(
      await screen.findByRole("button", { name: "Mute water sounds" }),
    );

    expect(localStorage.getItem("gympi.hydrationSoundEnabled")).toBe("false");
    expect(
      screen.getByRole("button", { name: "Enable water sounds" }),
    ).toBeInTheDocument();
  });

  it("does not claim persistence failed when only the refresh fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse(emptyOverview))
        .mockResolvedValueOnce(
          jsonResponse(
            {
              id: "b9c4fc26-52cd-4f42-9ad8-a891389e42ce",
              amountMl: 250,
              consumedAtUtc: "2026-09-15T12:30:00Z",
            },
            201,
          ),
        )
        .mockResolvedValueOnce(jsonResponse({}, 500)),
    );

    render(
      <MemoryRouter>
        <ActiveProfileProvider>
          <HydrationPage />
        </ActiveProfileProvider>
      </MemoryRouter>,
    );

    await user.click(
      await screen.findByRole("button", { name: "Add 250 ml" }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Water was recorded, but progress could not refresh.");
    expect(waterDropSound.playWaterDrop).toHaveBeenCalledOnce();
  });
});
