namespace GymPi.Application.Profiles;

public sealed record ProfileSummary(
    Guid Id,
    string DisplayName,
    string TimeZoneId,
    int DailyHydrationGoalMl,
    DateTimeOffset CreatedAtUtc);
