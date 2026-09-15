using GymPi.Domain.Profiles;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GymPi.Infrastructure.Persistence.Configurations;

internal sealed class HouseholdProfileConfiguration
    : IEntityTypeConfiguration<HouseholdProfile>
{
    public void Configure(EntityTypeBuilder<HouseholdProfile> builder)
    {
        builder.ToTable(
            "household_profiles",
            table => table.HasCheckConstraint(
                "ck_household_profiles_hydration_goal",
                "daily_hydration_goal_ml BETWEEN 250 AND 10000"));

        builder.HasKey(profile => profile.Id)
            .HasName("pk_household_profiles");

        builder.Property(profile => profile.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();
        builder.Property(profile => profile.DisplayName)
            .HasColumnName("display_name")
            .HasMaxLength(HouseholdProfile.MaximumDisplayNameLength)
            .IsRequired();
        builder.Property(profile => profile.TimeZoneId)
            .HasColumnName("time_zone_id")
            .HasMaxLength(HouseholdProfile.MaximumTimeZoneIdLength)
            .IsRequired();
        builder.Property(profile => profile.DailyHydrationGoalMl)
            .HasColumnName("daily_hydration_goal_ml")
            .IsRequired();
        builder.Property(profile => profile.CreatedAtUtc)
            .HasColumnName("created_at_utc")
            .IsRequired();
    }
}
