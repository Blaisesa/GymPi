using GymPi.Domain.Profiles;

namespace GymPi.Application.Profiles;

public sealed class CreateProfileHandler
{
    private readonly IProfileStore profileStore;
    private readonly TimeProvider timeProvider;

    public CreateProfileHandler(
        IProfileStore profileStore,
        TimeProvider timeProvider)
    {
        this.profileStore = profileStore;
        this.timeProvider = timeProvider;
    }

    public async Task<ProfileSummary> HandleAsync(
        CreateProfileCommand command,
        CancellationToken cancellationToken)
    {
        var profile = HouseholdProfile.Create(
            Guid.NewGuid(),
            command.DisplayName,
            command.TimeZoneId,
            command.DailyHydrationGoalMl,
            timeProvider.GetUtcNow());

        await profileStore.AddAsync(profile, cancellationToken);

        return ProfileMapping.ToSummary(profile);
    }
}
