namespace GymPi.Application.Profiles;

public sealed record CreateProfileCommand(
    string DisplayName,
    string TimeZoneId,
    int DailyHydrationGoalMl);
