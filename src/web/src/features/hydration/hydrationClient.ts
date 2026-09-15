export interface HydrationEntry {
  id: string;
  amountMl: number;
  consumedAtUtc: string;
}

export interface HydrationOverview {
  localDate: string;
  timeZoneId: string;
  goalMl: number;
  consumedMl: number;
  remainingMl: number;
  entries: HydrationEntry[];
}

function isHydrationEntry(value: unknown): value is HydrationEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "amountMl" in value &&
    Number.isInteger(value.amountMl) &&
    "consumedAtUtc" in value &&
    typeof value.consumedAtUtc === "string"
  );
}

function isHydrationOverview(value: unknown): value is HydrationOverview {
  return (
    typeof value === "object" &&
    value !== null &&
    "localDate" in value &&
    typeof value.localDate === "string" &&
    "goalMl" in value &&
    Number.isInteger(value.goalMl) &&
    "consumedMl" in value &&
    Number.isInteger(value.consumedMl) &&
    "remainingMl" in value &&
    Number.isInteger(value.remainingMl) &&
    "timeZoneId" in value &&
    typeof value.timeZoneId === "string" &&
    "entries" in value &&
    Array.isArray(value.entries) &&
    value.entries.every(isHydrationEntry)
  );
}

export async function getHydrationOverview(
  profileId: string,
  signal?: AbortSignal,
): Promise<HydrationOverview> {
  const response = await fetch(
    `/api/profiles/${encodeURIComponent(profileId)}/hydration-overview`,
    {
      headers: { Accept: "application/json" },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      `GymPi hydration request failed with status ${response.status}.`,
    );
  }

  const payload: unknown = await response.json();

  if (!isHydrationOverview(payload)) {
    throw new Error("GymPi hydration response was invalid.");
  }

  return payload;
}

export async function recordHydrationEntry(
  profileId: string,
  amountMl: number,
  signal?: AbortSignal,
): Promise<HydrationEntry> {
  const response = await fetch(
    `/api/profiles/${encodeURIComponent(profileId)}/hydration-entries`,
    {
      body: JSON.stringify({ amountMl }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      `GymPi hydration entry failed with status ${response.status}.`,
    );
  }

  const payload: unknown = await response.json();

  if (!isHydrationEntry(payload)) {
    throw new Error("GymPi hydration entry response was invalid.");
  }

  return payload;
}
