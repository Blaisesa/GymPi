using GymPi.Application.Profiles;
using GymPi.Domain.Hydration;

namespace GymPi.Application.Hydration;

public sealed class RecordHydrationHandler
{
    private readonly IHydrationStore hydrationStore;
    private readonly IProfileStore profileStore;
    private readonly TimeProvider timeProvider;

    public RecordHydrationHandler(
        IHydrationStore hydrationStore,
        IProfileStore profileStore,
        TimeProvider timeProvider)
    {
        this.hydrationStore = hydrationStore;
        this.profileStore = profileStore;
        this.timeProvider = timeProvider;
    }

    public async Task<HydrationEntrySummary> HandleAsync(
        RecordHydrationCommand command,
        CancellationToken cancellationToken)
    {
        var profile = await profileStore.GetAsync(
            command.ProfileId,
            cancellationToken);

        if (profile is null)
        {
            throw new KeyNotFoundException("Household profile was not found.");
        }

        var entry = HydrationEntry.Record(
            Guid.NewGuid(),
            profile.Id,
            command.AmountMl,
            timeProvider.GetUtcNow());

        await hydrationStore.AddAsync(entry, cancellationToken);

        return ToSummary(entry);
    }

    internal static HydrationEntrySummary ToSummary(HydrationEntry entry)
    {
        return new HydrationEntrySummary(
            entry.Id,
            entry.AmountMl,
            entry.ConsumedAtUtc);
    }
}
