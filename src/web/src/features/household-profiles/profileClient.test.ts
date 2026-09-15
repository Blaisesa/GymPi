import { afterEach, describe, expect, it, vi } from "vitest";

import { createProfile, listProfiles } from "./profileClient";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("profileClient", () => {
  it("lists household profiles from the API", async () => {
    const profiles = [
      {
        id: "2e6a67ff-6e09-46a1-87ec-cf674a3ccbc4",
        displayName: "Blaise",
        timeZoneId: "Europe/Dublin",
        dailyHydrationGoalMl: 2500,
        createdAtUtc: "2026-09-15T10:00:00Z",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(profiles),
        ok: true,
      }),
    );

    await expect(listProfiles()).resolves.toEqual(profiles);
    expect(fetch).toHaveBeenCalledWith("/api/profiles", {
      headers: { Accept: "application/json" },
      signal: undefined,
    });
  });

  it("creates a household profile through the API", async () => {
    const input = {
      displayName: "Blaise",
      timeZoneId: "Europe/Dublin",
      dailyHydrationGoalMl: 2500,
    };
    const profile = {
      id: "2e6a67ff-6e09-46a1-87ec-cf674a3ccbc4",
      ...input,
      createdAtUtc: "2026-09-15T10:00:00Z",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(profile),
        ok: true,
      }),
    );

    await expect(createProfile(input)).resolves.toEqual(profile);
    expect(fetch).toHaveBeenCalledWith("/api/profiles", {
      body: JSON.stringify(input),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: undefined,
    });
  });

  it("rejects an invalid profile response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ displayName: "Missing fields" }),
        ok: true,
      }),
    );

    await expect(listProfiles()).rejects.toThrow(
      "GymPi profiles response was invalid.",
    );
  });
});
