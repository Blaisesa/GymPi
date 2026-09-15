using GymPi.Domain.Hydration;
using GymPi.Domain.Profiles;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GymPi.Infrastructure.Persistence.Configurations;

internal sealed class HydrationEntryConfiguration
    : IEntityTypeConfiguration<HydrationEntry>
{
    public void Configure(EntityTypeBuilder<HydrationEntry> builder)
    {
        builder.ToTable(
            "hydration_entries",
            table => table.HasCheckConstraint(
                "ck_hydration_entries_amount",
                "amount_ml BETWEEN 1 AND 5000"));

        builder.HasKey(entry => entry.Id)
            .HasName("pk_hydration_entries");

        builder.Property(entry => entry.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();
        builder.Property(entry => entry.ProfileId)
            .HasColumnName("profile_id")
            .IsRequired();
        builder.Property(entry => entry.AmountMl)
            .HasColumnName("amount_ml")
            .IsRequired();
        builder.Property(entry => entry.ConsumedAtUtc)
            .HasColumnName("consumed_at_utc")
            .IsRequired();

        builder.HasIndex(entry => new { entry.ProfileId, entry.ConsumedAtUtc })
            .HasDatabaseName("ix_hydration_entries_profile_consumed_at");

        builder.HasOne<HouseholdProfile>()
            .WithMany()
            .HasForeignKey(entry => entry.ProfileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName(
                "fk_hydration_entries_household_profiles_profile_id");
    }
}
