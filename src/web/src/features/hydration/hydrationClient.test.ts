import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getHydration,
  recordHydrationEntry,
} from "./hydrationClient";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("hydrationClient", () => {
  it("loads a bounded hydration range", async () => {
    const hydration = {
      startDate: "2026-09-09",
      endDate: "2026-09-15",
      timeZoneId: "Europe/Dublin",
      dailyGoalMl: 2500,
      days: [{ localDate: "2026-09-15", consumedMl: 250 }],
      todayEntries: [],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(hydration),
        ok: true,
      }),
    );

    await expect(getHydration("profile-id")).resolves.toEqual(hydration);
    expect(fetch).toHaveBeenCalledWith(
      "/api/profiles/profile-id/hydration?days=7",
      {
        headers: { Accept: "application/json" },
        signal: undefined,
      },
    );
  });

  it("records a hydration entry", async () => {
    const entry = {
      id: "entry-id",
      amountMl: 250,
      consumedAtUtc: "2026-09-15T12:30:00Z",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(entry),
        ok: true,
      }),
    );

    await expect(recordHydrationEntry("profile-id", 250)).resolves.toEqual(
      entry,
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/profiles/profile-id/hydration-entries",
      {
        body: JSON.stringify({ amountMl: 250 }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: undefined,
      },
    );
  });

  it("rejects an invalid overview response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ consumedMl: "250" }),
        ok: true,
      }),
    );

    await expect(getHydration("profile-id")).rejects.toThrow(
      "GymPi hydration response was invalid.",
    );
  });

  it("rejects a hydration range with an unusable daily goal", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          startDate: "2026-09-15",
          endDate: "2026-09-15",
          timeZoneId: "Europe/Dublin",
          dailyGoalMl: 0,
          days: [{ localDate: "2026-09-15", consumedMl: 0 }],
          todayEntries: [],
        }),
        ok: true,
      }),
    );

    await expect(getHydration("profile-id")).rejects.toThrow(
      "GymPi hydration response was invalid.",
    );
  });
});
