import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SystemStatus } from "./SystemStatus";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SystemStatus", () => {
  it("shows that the connection is being checked while the request is pending", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => undefined)));

    render(<SystemStatus />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Checking connection…",
    );
  });

  it("shows connected after receiving a healthy response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ status: "healthy" }),
        ok: true,
      }),
    );

    render(<SystemStatus />);

    expect(await screen.findByText("Connected")).toBeInTheDocument();
  });

  it("shows unavailable when the health request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Network request failed")),
    );

    render(<SystemStatus />);

    expect(await screen.findByText("Unavailable")).toBeInTheDocument();
  });
});
