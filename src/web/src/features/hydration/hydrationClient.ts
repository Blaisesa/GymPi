export interface HydrationEntry {
  id: string;
  amountMl: number;
  consumedAtUtc: string;
}

export interface HydrationDaySummary {
  localDate: string;
  consumedMl: number;
}

export interface HydrationSummary {
  startDate: string;
  endDate: string;
  timeZoneId: string;
  dailyGoalMl: number;
  days: HydrationDaySummary[];
  todayEntries: HydrationEntry[];
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

function isHydrationDaySummary(value: unknown): value is HydrationDaySummary {
  return (
    typeof value === "object" &&
    value !== null &&
    "localDate" in value &&
    typeof value.localDate === "string" &&
    "consumedMl" in value &&
    typeof value.consumedMl === "number" &&
    Number.isInteger(value.consumedMl) &&
    value.consumedMl >= 0
  );
}

function isHydrationSummary(value: unknown): value is HydrationSummary {
  return (
    typeof value === "object" &&
    value !== null &&
    "startDate" in value &&
    typeof value.startDate === "string" &&
    "endDate" in value &&
    typeof value.endDate === "string" &&
    "timeZoneId" in value &&
    typeof value.timeZoneId === "string" &&
    "dailyGoalMl" in value &&
    typeof value.dailyGoalMl === "number" &&
    Number.isInteger(value.dailyGoalMl) &&
    value.dailyGoalMl > 0 &&
    "days" in value &&
    Array.isArray(value.days) &&
    value.days.length > 0 &&
    value.days.every(isHydrationDaySummary) &&
    "todayEntries" in value &&
    Array.isArray(value.todayEntries) &&
    value.todayEntries.every(isHydrationEntry)
  );
}

export async function getHydration(
  profileId: string,
  days = 7,
  signal?: AbortSignal,
): Promise<HydrationSummary> {
  const response = await fetch(
    `/api/profiles/${encodeURIComponent(profileId)}/hydration?days=${days}`,
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

  if (!isHydrationSummary(payload)) {
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
