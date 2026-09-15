using GymPi.Domain.Profiles;

namespace GymPi.Application.Profiles;

public interface IProfileStore
{
    Task<HouseholdProfile?> GetAsync(
        Guid profileId,
        CancellationToken cancellationToken);

    Task AddAsync(HouseholdProfile profile, CancellationToken cancellationToken);

    Task<IReadOnlyList<HouseholdProfile>> ListAsync(
        CancellationToken cancellationToken);
}
