namespace GymPi.Application.Profiles;

public sealed class ListProfilesHandler
{
    private readonly IProfileStore profileStore;

    public ListProfilesHandler(IProfileStore profileStore)
    {
        this.profileStore = profileStore;
    }

    public async Task<IReadOnlyList<ProfileSummary>> HandleAsync(
        CancellationToken cancellationToken)
    {
        var profiles = await profileStore.ListAsync(cancellationToken);

        return profiles.Select(ProfileMapping.ToSummary).ToArray();
    }
}
