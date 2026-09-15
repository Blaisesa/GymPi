using GymPi.Domain.Hydration;

using Xunit;

namespace GymPi.Domain.Tests.Hydration;

public sealed class HydrationDayTests
{
    [Fact]
    public void OnUsesProfileTimeZoneAcrossDaylightSavingChange()
    {
        var day = HydrationDay.On(
            new DateOnly(2026, 10, 25),
            "Europe/Dublin");

        Assert.Equal(new DateOnly(2026, 10, 25), day.LocalDate);
        Assert.Equal(
            new DateTimeOffset(2026, 10, 24, 23, 0, 0, TimeSpan.Zero),
            day.StartsAtUtc);
        Assert.Equal(
            new DateTimeOffset(2026, 10, 26, 0, 0, 0, TimeSpan.Zero),
            day.EndsAtUtc);
    }

    [Fact]
    public void ContainingUsesProfileTimeZoneAcrossDaylightSavingChange()
    {
        var instant = new DateTimeOffset(
            2026,
            3,
            29,
            12,
            0,
            0,
            TimeSpan.Zero);

        var day = HydrationDay.Containing(instant, "Europe/Dublin");

        Assert.Equal(new DateOnly(2026, 3, 29), day.LocalDate);
        Assert.Equal(
            new DateTimeOffset(2026, 3, 29, 0, 0, 0, TimeSpan.Zero),
            day.StartsAtUtc);
        Assert.Equal(
            new DateTimeOffset(2026, 3, 29, 23, 0, 0, TimeSpan.Zero),
            day.EndsAtUtc);
    }
}
