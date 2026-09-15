using GymPi.Domain.Profiles;

namespace GymPi.Application.Profiles;

internal static class ProfileMapping
{
    public static ProfileSummary ToSummary(HouseholdProfile profile)
    {
        return new ProfileSummary(
            profile.Id,
            profile.DisplayName,
            profile.TimeZoneId,
            profile.DailyHydrationGoalMl,
            profile.CreatedAtUtc);
    }
}
