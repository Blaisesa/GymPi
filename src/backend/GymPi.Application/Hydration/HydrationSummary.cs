namespace GymPi.Application.Hydration;

public sealed record HydrationSummary(
    DateOnly StartDate,
    DateOnly EndDate,
    string TimeZoneId,
    int DailyGoalMl,
    IReadOnlyList<HydrationDaySummary> Days,
    IReadOnlyList<HydrationEntrySummary> TodayEntries);
