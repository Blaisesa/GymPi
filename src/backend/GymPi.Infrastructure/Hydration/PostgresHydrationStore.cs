using GymPi.Application.Hydration;
using GymPi.Domain.Hydration;
using GymPi.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;

namespace GymPi.Infrastructure.Hydration;

internal sealed class PostgresHydrationStore : IHydrationStore
{
    private readonly GymPiDbContext dbContext;

    public PostgresHydrationStore(GymPiDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task AddAsync(
        HydrationEntry entry,
        CancellationToken cancellationToken)
    {
        dbContext.HydrationEntries.Add(entry);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<HydrationEntry>> ListAsync(
        Guid profileId,
        DateTimeOffset startsAtUtc,
        DateTimeOffset endsAtUtc,
        CancellationToken cancellationToken)
    {
        return await dbContext.HydrationEntries
            .AsNoTracking()
            .Where(entry => entry.ProfileId == profileId)
            .Where(entry => entry.ConsumedAtUtc >= startsAtUtc)
            .Where(entry => entry.ConsumedAtUtc < endsAtUtc)
            .OrderByDescending(entry => entry.ConsumedAtUtc)
            .ThenByDescending(entry => entry.Id)
            .ToListAsync(cancellationToken);
    }
}
