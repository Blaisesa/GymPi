import { afterEach, describe, expect, it, vi } from "vitest";

import { getSystemHealth } from "./systemHealthClient";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getSystemHealth", () => {
  it("returns the healthy response from the same-origin endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ status: "healthy" }),
      ok: true,
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(getSystemHealth()).resolves.toEqual({ status: "healthy" });
    expect(fetchMock).toHaveBeenCalledWith("/api/health", {
      headers: {
        Accept: "application/json",
      },
      signal: undefined,
    });
  });

  it("rejects a non-successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    await expect(getSystemHealth()).rejects.toThrow(
      "GymPi health request failed with status 503.",
    );
  });

  it("rejects an unexpected response body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ status: "unknown" }),
        ok: true,
      }),
    );

    await expect(getSystemHealth()).rejects.toThrow(
      "GymPi health response was invalid.",
    );
  });
});
