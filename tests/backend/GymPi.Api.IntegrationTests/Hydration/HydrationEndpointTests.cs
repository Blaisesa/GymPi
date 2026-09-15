using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

using GymPi.Api.IntegrationTests.Profiles;

using Xunit;

namespace GymPi.Api.IntegrationTests.Hydration;

public sealed class HydrationEndpointTests
    : IClassFixture<PostgresApiFixture>
{
    private readonly HttpClient client;

    public HydrationEndpointTests(PostgresApiFixture fixture)
    {
        client = fixture.Client;
    }

    [Fact]
    public async Task RecordHydrationAppearsInGeneralHydrationResource()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        var profileId = await CreateProfileAsync(cancellationToken);

        using var createResponse = await client.PostAsJsonAsync(
            $"/api/profiles/{profileId}/hydration-entries",
            new { AmountMl = 250 },
            cancellationToken);

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createdEntry = await createResponse.Content
            .ReadFromJsonAsync<JsonElement>(cancellationToken);
        Assert.Equal(250, createdEntry.GetProperty("amountMl").GetInt32());

        var hydration = await client.GetFromJsonAsync<JsonElement>(
            $"/api/profiles/{profileId}/hydration?days=7",
            cancellationToken);

        Assert.Equal(2500, hydration.GetProperty("dailyGoalMl").GetInt32());
        Assert.Equal(
            "Europe/Dublin",
            hydration.GetProperty("timeZoneId").GetString());

        var days = hydration.GetProperty("days").EnumerateArray().ToArray();
        Assert.Equal(7, days.Length);
        Assert.Equal(250, days[^1].GetProperty("consumedMl").GetInt32());
        Assert.Single(hydration.GetProperty("todayEntries").EnumerateArray());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(5001)]
    public async Task RecordHydrationRejectsInvalidAmount(int amountMl)
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        var profileId = await CreateProfileAsync(cancellationToken);

        using var response = await client.PostAsJsonAsync(
            $"/api/profiles/{profileId}/hydration-entries",
            new { AmountMl = amountMl },
            cancellationToken);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task HydrationReturnsNotFoundForUnknownProfile()
    {
        var cancellationToken = TestContext.Current.CancellationToken;

        using var response = await client.GetAsync(
            $"/api/profiles/{Guid.NewGuid()}/hydration?days=7",
            cancellationToken);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(32)]
    public async Task HydrationRejectsAnUnboundedDayRange(int days)
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        var profileId = await CreateProfileAsync(cancellationToken);

        using var response = await client.GetAsync(
            $"/api/profiles/{profileId}/hydration?days={days}",
            cancellationToken);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private async Task<Guid> CreateProfileAsync(CancellationToken cancellationToken)
    {
        using var response = await client.PostAsJsonAsync(
            "/api/profiles",
            new
            {
                DisplayName = $"Hydration {Guid.NewGuid():N}",
                TimeZoneId = "Europe/Dublin",
                DailyHydrationGoalMl = 2500,
            },
            cancellationToken);

        response.EnsureSuccessStatusCode();
        var profile = await response.Content
            .ReadFromJsonAsync<JsonElement>(cancellationToken);

        return profile.GetProperty("id").GetGuid();
    }
}
