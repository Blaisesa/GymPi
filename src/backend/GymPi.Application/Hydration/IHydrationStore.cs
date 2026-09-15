using GymPi.Domain.Hydration;

namespace GymPi.Application.Hydration;

public interface IHydrationStore
{
    Task AddAsync(
        HydrationEntry entry,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<HydrationEntry>> ListAsync(
        Guid profileId,
        DateTimeOffset startsAtUtc,
        DateTimeOffset endsAtUtc,
        CancellationToken cancellationToken);
}
