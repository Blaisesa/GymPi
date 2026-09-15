using GymPi.Domain.Profiles;

using Xunit;

namespace GymPi.Domain.Tests.Profiles;

public sealed class HouseholdProfileTests
{
    private static readonly DateTimeOffset CreatedAt =
        new(2026, 9, 15, 10, 0, 0, TimeSpan.Zero);

    [Fact]
    public void CreateNormalizesValidProfileData()
    {
        var profile = HouseholdProfile.Create(
            Guid.NewGuid(),
            "  Blaise  ",
            "  Europe/Dublin  ",
            2500,
            CreatedAt.ToOffset(TimeSpan.FromHours(2)));

        Assert.Equal("Blaise", profile.DisplayName);
        Assert.Equal("Europe/Dublin", profile.TimeZoneId);
        Assert.Equal(2500, profile.DailyHydrationGoalMl);
        Assert.Equal(TimeSpan.Zero, profile.CreatedAtUtc.Offset);
    }

    [Fact]
    public void CreateRejectsBlankDisplayName()
    {
        var exception = Assert.Throws<ArgumentException>(() =>
            HouseholdProfile.Create(
                Guid.NewGuid(),
                " ",
                "Europe/Dublin",
                2500,
                CreatedAt));

        Assert.Equal("displayName", exception.ParamName);
    }

    [Fact]
    public void CreateRejectsUnknownTimeZone()
    {
        var exception = Assert.Throws<ArgumentException>(() =>
            HouseholdProfile.Create(
                Guid.NewGuid(),
                "Blaise",
                "Mars/Olympus_Mons",
                2500,
                CreatedAt));

        Assert.Equal("timeZoneId", exception.ParamName);
    }

    [Theory]
    [InlineData(249)]
    [InlineData(10001)]
    public void CreateRejectsHydrationGoalOutsideAllowedRange(int goalMl)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            HouseholdProfile.Create(
                Guid.NewGuid(),
                "Blaise",
                "Europe/Dublin",
                goalMl,
                CreatedAt));

        Assert.Equal("dailyHydrationGoalMl", exception.ParamName);
    }
}
