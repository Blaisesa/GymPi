using GymPi.Domain.Hydration;

using Xunit;

namespace GymPi.Domain.Tests.Hydration;

public sealed class HydrationEntryTests
{
    private static readonly DateTimeOffset ConsumedAt =
        new(2026, 9, 15, 12, 30, 0, TimeSpan.Zero);

    [Fact]
    public void RecordCreatesValidEntry()
    {
        var id = Guid.NewGuid();
        var profileId = Guid.NewGuid();

        var entry = HydrationEntry.Record(id, profileId, 250, ConsumedAt);

        Assert.Equal(id, entry.Id);
        Assert.Equal(profileId, entry.ProfileId);
        Assert.Equal(250, entry.AmountMl);
        Assert.Equal(ConsumedAt, entry.ConsumedAtUtc);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(5001)]
    public void RecordRejectsAmountOutsideAllowedRange(int amountMl)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            HydrationEntry.Record(
                Guid.NewGuid(),
                Guid.NewGuid(),
                amountMl,
                ConsumedAt));

        Assert.Equal("amountMl", exception.ParamName);
    }
}
