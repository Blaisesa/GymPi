namespace GymPi.Application.Hydration;

public sealed record HydrationEntrySummary(
    Guid Id,
    int AmountMl,
    DateTimeOffset ConsumedAtUtc);
