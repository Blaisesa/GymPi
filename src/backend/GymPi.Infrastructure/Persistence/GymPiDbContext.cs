using GymPi.Domain.Hydration;
using GymPi.Domain.Profiles;
using GymPi.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;

namespace GymPi.Infrastructure.Persistence;

public sealed class GymPiDbContext : DbContext
{
    public GymPiDbContext(DbContextOptions<GymPiDbContext> options)
        : base(options)
    {
    }

    internal DbSet<HouseholdProfile> HouseholdProfiles =>
        Set<HouseholdProfile>();

    internal DbSet<HydrationEntry> HydrationEntries =>
        Set<HydrationEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new HydrationEntryConfiguration());
        modelBuilder.ApplyConfiguration(new HouseholdProfileConfiguration());
    }
}
