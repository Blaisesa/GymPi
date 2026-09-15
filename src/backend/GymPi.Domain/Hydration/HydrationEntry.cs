namespace GymPi.Domain.Hydration;

public sealed class HydrationEntry
{
    public const int MinimumAmountMl = 1;
    public const int MaximumAmountMl = 5_000;

    private HydrationEntry()
    {
    }

    private HydrationEntry(
        Guid id,
        Guid profileId,
        int amountMl,
        DateTimeOffset consumedAtUtc)
    {
        Id = id;
        ProfileId = profileId;
        AmountMl = amountMl;
        ConsumedAtUtc = consumedAtUtc;
    }

    public Guid Id { get; private set; }

    public Guid ProfileId { get; private set; }

    public int AmountMl { get; private set; }

    public DateTimeOffset ConsumedAtUtc { get; private set; }

    public static HydrationEntry Record(
        Guid id,
        Guid profileId,
        int amountMl,
        DateTimeOffset consumedAtUtc)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Hydration entry ID is required.", nameof(id));
        }

        if (profileId == Guid.Empty)
        {
            throw new ArgumentException("Profile ID is required.", nameof(profileId));
        }

        if (amountMl is < MinimumAmountMl or > MaximumAmountMl)
        {
            throw new ArgumentOutOfRangeException(
                nameof(amountMl),
                amountMl,
                $"Hydration amount must be between {MinimumAmountMl} and {MaximumAmountMl} ml.");
        }

        return new HydrationEntry(
            id,
            profileId,
            amountMl,
            consumedAtUtc.ToUniversalTime());
    }
}
