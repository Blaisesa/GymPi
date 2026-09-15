namespace GymPi.Application.Hydration;

public sealed record HydrationOverview(
    DateOnly LocalDate,
    string TimeZoneId,
    int GoalMl,
    int ConsumedMl,
    int RemainingMl,
    IReadOnlyList<HydrationEntrySummary> Entries);
