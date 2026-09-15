using GymPi.Application.Profiles;
using GymPi.Domain.Hydration;

namespace GymPi.Application.Hydration;

public sealed class GetHydrationOverviewHandler
{
    private readonly IHydrationStore hydrationStore;
    private readonly IProfileStore profileStore;
    private readonly TimeProvider timeProvider;

    public GetHydrationOverviewHandler(
        IHydrationStore hydrationStore,
        IProfileStore profileStore,
        TimeProvider timeProvider)
    {
        this.hydrationStore = hydrationStore;
        this.profileStore = profileStore;
        this.timeProvider = timeProvider;
    }

    public async Task<HydrationOverview> HandleAsync(
        Guid profileId,
        CancellationToken cancellationToken)
    {
        var profile = await profileStore.GetAsync(profileId, cancellationToken);

        if (profile is null)
        {
            throw new KeyNotFoundException("Household profile was not found.");
        }

        var day = HydrationDay.Containing(
            timeProvider.GetUtcNow(),
            profile.TimeZoneId);
        var entries = await hydrationStore.ListAsync(
            profile.Id,
            day.StartsAtUtc,
            day.EndsAtUtc,
            cancellationToken);
        var consumedMl = entries.Sum(entry => entry.AmountMl);

        return new HydrationOverview(
            day.LocalDate,
            profile.TimeZoneId,
            profile.DailyHydrationGoalMl,
            consumedMl,
            Math.Max(0, profile.DailyHydrationGoalMl - consumedMl),
            entries.Select(RecordHydrationHandler.ToSummary).ToArray());
    }
}
