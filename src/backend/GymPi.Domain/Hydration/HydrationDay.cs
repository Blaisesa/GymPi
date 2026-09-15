namespace GymPi.Domain.Hydration;

public sealed record HydrationDay(
    DateOnly LocalDate,
    DateTimeOffset StartsAtUtc,
    DateTimeOffset EndsAtUtc)
{
    public static HydrationDay Containing(
        DateTimeOffset instant,
        string timeZoneId)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
        var localInstant = TimeZoneInfo.ConvertTime(instant, timeZone);
        var localDate = DateOnly.FromDateTime(localInstant.DateTime);

        return On(localDate, timeZoneId);
    }

    public static HydrationDay On(
        DateOnly localDate,
        string timeZoneId)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
        var localStart = DateTime.SpecifyKind(
            localDate.ToDateTime(TimeOnly.MinValue),
            DateTimeKind.Unspecified);
        var localEnd = localStart.AddDays(1);

        return new HydrationDay(
            localDate,
            new DateTimeOffset(
                TimeZoneInfo.ConvertTimeToUtc(localStart, timeZone),
                TimeSpan.Zero),
            new DateTimeOffset(
                TimeZoneInfo.ConvertTimeToUtc(localEnd, timeZone),
                TimeSpan.Zero));
    }
}
