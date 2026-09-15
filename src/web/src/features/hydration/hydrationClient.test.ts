import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getHydrationOverview,
  recordHydrationEntry,
} from "./hydrationClient";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("hydrationClient", () => {
  it("loads today's hydration overview", async () => {
    const overview = {
      localDate: "2026-09-15",
      timeZoneId: "Europe/Dublin",
      goalMl: 2500,
      consumedMl: 250,
      remainingMl: 2250,
      entries: [],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(overview),
        ok: true,
      }),
    );

    await expect(getHydrationOverview("profile-id")).resolves.toEqual(overview);
    expect(fetch).toHaveBeenCalledWith(
      "/api/profiles/profile-id/hydration-overview",
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

    await expect(getHydrationOverview("profile-id")).rejects.toThrow(
      "GymPi hydration response was invalid.",
    );
  });
});
