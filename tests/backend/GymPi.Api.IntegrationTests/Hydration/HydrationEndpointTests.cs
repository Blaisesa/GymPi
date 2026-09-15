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
    public async Task RecordHydrationPersistsItInTodaysOverview()
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

        var overview = await client.GetFromJsonAsync<JsonElement>(
            $"/api/profiles/{profileId}/hydration-overview",
            cancellationToken);

        Assert.Equal(2500, overview.GetProperty("goalMl").GetInt32());
        Assert.Equal(
            "Europe/Dublin",
            overview.GetProperty("timeZoneId").GetString());
        Assert.Equal(250, overview.GetProperty("consumedMl").GetInt32());
        Assert.Equal(2250, overview.GetProperty("remainingMl").GetInt32());
        Assert.Single(overview.GetProperty("entries").EnumerateArray());
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
    public async Task HydrationOverviewReturnsNotFoundForUnknownProfile()
    {
        var cancellationToken = TestContext.Current.CancellationToken;

        using var response = await client.GetAsync(
            $"/api/profiles/{Guid.NewGuid()}/hydration-overview",
            cancellationToken);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
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
