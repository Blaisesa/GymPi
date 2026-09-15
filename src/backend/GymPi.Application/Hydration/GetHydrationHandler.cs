using GymPi.Application.Profiles;
using GymPi.Domain.Hydration;

namespace GymPi.Application.Hydration;

public sealed class GetHydrationHandler
{
    public const int DefaultDays = 7;
    public const int MaximumDays = 31;

    private readonly IHydrationStore hydrationStore;
    private readonly IProfileStore profileStore;
    private readonly TimeProvider timeProvider;

    public GetHydrationHandler(
        IHydrationStore hydrationStore,
        IProfileStore profileStore,
        TimeProvider timeProvider)
    {
        this.hydrationStore = hydrationStore;
        this.profileStore = profileStore;
        this.timeProvider = timeProvider;
    }

    public async Task<HydrationSummary> HandleAsync(
        Guid profileId,
        int days,
        CancellationToken cancellationToken)
    {
        if (days is < 1 or > MaximumDays)
        {
            throw new ArgumentOutOfRangeException(
                nameof(days),
                days,
                $"Hydration range must be between 1 and {MaximumDays} days.");
        }

        var profile = await profileStore.GetAsync(profileId, cancellationToken);

        if (profile is null)
        {
            throw new KeyNotFoundException("Household profile was not found.");
        }

        var today = HydrationDay.Containing(
            timeProvider.GetUtcNow(),
            profile.TimeZoneId);
        var startDate = today.LocalDate.AddDays(-(days - 1));
        var startDay = HydrationDay.On(startDate, profile.TimeZoneId);
        var entries = await hydrationStore.ListAsync(
            profile.Id,
            startDay.StartsAtUtc,
            today.EndsAtUtc,
            cancellationToken);
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(profile.TimeZoneId);
        var localEntries = entries
            .Select(entry => new
            {
                Entry = entry,
                LocalDate = DateOnly.FromDateTime(
                    TimeZoneInfo.ConvertTime(entry.ConsumedAtUtc, timeZone).DateTime),
            })
            .ToArray();
        var consumedByDate = localEntries
            .GroupBy(item => item.LocalDate)
            .ToDictionary(
                group => group.Key,
                group => group.Sum(item => item.Entry.AmountMl));
        var daySummaries = Enumerable.Range(0, days)
            .Select(offset => startDate.AddDays(offset))
            .Select(localDate => new HydrationDaySummary(
                localDate,
                consumedByDate.GetValueOrDefault(localDate)))
            .ToArray();
        var todayEntries = localEntries
            .Where(item => item.LocalDate == today.LocalDate)
            .Select(item => RecordHydrationHandler.ToSummary(item.Entry))
            .ToArray();

        return new HydrationSummary(
            startDate,
            today.LocalDate,
            profile.TimeZoneId,
            profile.DailyHydrationGoalMl,
            daySummaries,
            todayEntries);
    }
}
