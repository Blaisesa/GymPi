export interface HouseholdProfile {
  id: string;
  displayName: string;
  timeZoneId: string;
  dailyHydrationGoalMl: number;
  createdAtUtc: string;
}

export interface CreateProfileInput {
  displayName: string;
  timeZoneId: string;
  dailyHydrationGoalMl: number;
}

function isHouseholdProfile(value: unknown): value is HouseholdProfile {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "displayName" in value &&
    typeof value.displayName === "string" &&
    "timeZoneId" in value &&
    typeof value.timeZoneId === "string" &&
    "dailyHydrationGoalMl" in value &&
    Number.isInteger(value.dailyHydrationGoalMl) &&
    "createdAtUtc" in value &&
    typeof value.createdAtUtc === "string"
  );
}

export async function listProfiles(
  signal?: AbortSignal,
): Promise<HouseholdProfile[]> {
  const response = await fetch("/api/profiles", {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `GymPi profiles request failed with status ${response.status}.`,
    );
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload) || !payload.every(isHouseholdProfile)) {
    throw new Error("GymPi profiles response was invalid.");
  }

  return payload;
}

export async function createProfile(
  input: CreateProfileInput,
  signal?: AbortSignal,
): Promise<HouseholdProfile> {
  const response = await fetch("/api/profiles", {
    body: JSON.stringify(input),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `GymPi profile creation failed with status ${response.status}.`,
    );
  }

  const payload: unknown = await response.json();

  if (!isHouseholdProfile(payload)) {
    throw new Error("GymPi profile response was invalid.");
  }

  return payload;
}
