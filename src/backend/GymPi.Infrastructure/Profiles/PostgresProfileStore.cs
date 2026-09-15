using GymPi.Application.Profiles;
using GymPi.Domain.Profiles;
using GymPi.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;

namespace GymPi.Infrastructure.Profiles;

internal sealed class PostgresProfileStore : IProfileStore
{
    private readonly GymPiDbContext dbContext;

    public PostgresProfileStore(GymPiDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task AddAsync(
        HouseholdProfile profile,
        CancellationToken cancellationToken)
    {
        dbContext.HouseholdProfiles.Add(profile);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<HouseholdProfile>> ListAsync(
        CancellationToken cancellationToken)
    {
        return await dbContext.HouseholdProfiles
            .AsNoTracking()
            .OrderBy(profile => profile.CreatedAtUtc)
            .ThenBy(profile => profile.Id)
            .ToListAsync(cancellationToken);
    }
}
