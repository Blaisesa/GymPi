export interface SystemHealth {
  status: "healthy";
}

function isSystemHealth(value: unknown): value is SystemHealth {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    value.status === "healthy"
  );
}

export async function getSystemHealth(
  signal?: AbortSignal,
): Promise<SystemHealth> {
  const response = await fetch("/api/health", {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `GymPi health request failed with status ${response.status}.`,
    );
  }

  const payload: unknown = await response.json();

  if (!isSystemHealth(payload)) {
    throw new Error("GymPi health response was invalid.");
  }

  return payload;
}
