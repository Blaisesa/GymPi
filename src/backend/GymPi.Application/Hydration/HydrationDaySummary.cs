namespace GymPi.Application.Hydration;

public sealed record HydrationDaySummary(
    DateOnly LocalDate,
    int ConsumedMl);
