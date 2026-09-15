namespace GymPi.Domain.Profiles;

public sealed class HouseholdProfile
{
    public const int MaximumDisplayNameLength = 80;
    public const int MaximumTimeZoneIdLength = 100;
    public const int MinimumDailyHydrationGoalMl = 250;
    public const int MaximumDailyHydrationGoalMl = 10_000;

    private HouseholdProfile()
    {
    }

    private HouseholdProfile(
        Guid id,
        string displayName,
        string timeZoneId,
        int dailyHydrationGoalMl,
        DateTimeOffset createdAtUtc)
    {
        Id = id;
        DisplayName = displayName;
        TimeZoneId = timeZoneId;
        DailyHydrationGoalMl = dailyHydrationGoalMl;
        CreatedAtUtc = createdAtUtc;
    }

    public Guid Id { get; private set; }

    public string DisplayName { get; private set; } = string.Empty;

    public string TimeZoneId { get; private set; } = string.Empty;

    public int DailyHydrationGoalMl { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public static HouseholdProfile Create(
        Guid id,
        string displayName,
        string timeZoneId,
        int dailyHydrationGoalMl,
        DateTimeOffset createdAtUtc)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Profile ID is required.", nameof(id));
        }

        var normalizedDisplayName = displayName?.Trim() ?? string.Empty;

        if (normalizedDisplayName.Length == 0)
        {
            throw new ArgumentException(
                "Display name is required.",
                nameof(displayName));
        }

        if (normalizedDisplayName.Length > MaximumDisplayNameLength)
        {
            throw new ArgumentException(
                $"Display name cannot exceed {MaximumDisplayNameLength} characters.",
                nameof(displayName));
        }

        var normalizedTimeZoneId = timeZoneId?.Trim() ?? string.Empty;

        if (normalizedTimeZoneId.Length == 0)
        {
            throw new ArgumentException(
                "Time zone is required.",
                nameof(timeZoneId));
        }

        if (normalizedTimeZoneId.Length > MaximumTimeZoneIdLength)
        {
            throw new ArgumentException(
                $"Time zone cannot exceed {MaximumTimeZoneIdLength} characters.",
                nameof(timeZoneId));
        }

        try
        {
            normalizedTimeZoneId = TimeZoneInfo.FindSystemTimeZoneById(
                normalizedTimeZoneId).Id;
        }
        catch (TimeZoneNotFoundException)
        {
            throw InvalidTimeZone();
        }
        catch (InvalidTimeZoneException)
        {
            throw InvalidTimeZone();
        }

        if (dailyHydrationGoalMl is < MinimumDailyHydrationGoalMl
            or > MaximumDailyHydrationGoalMl)
        {
            throw new ArgumentOutOfRangeException(
                nameof(dailyHydrationGoalMl),
                dailyHydrationGoalMl,
                $"Daily hydration goal must be between {MinimumDailyHydrationGoalMl} and {MaximumDailyHydrationGoalMl} ml.");
        }

        return new HouseholdProfile(
            id,
            normalizedDisplayName,
            normalizedTimeZoneId,
            dailyHydrationGoalMl,
            createdAtUtc.ToUniversalTime());
    }

    private static ArgumentException InvalidTimeZone()
    {
        return new ArgumentException(
            "Time zone must be a valid IANA time zone ID.",
            "timeZoneId");
    }
}
