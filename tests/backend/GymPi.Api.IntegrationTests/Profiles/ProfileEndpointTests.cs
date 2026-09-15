using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

using Xunit;

namespace GymPi.Api.IntegrationTests.Profiles;

public sealed class ProfileEndpointTests
    : IClassFixture<PostgresApiFixture>
{
    private readonly HttpClient client;

    public ProfileEndpointTests(PostgresApiFixture fixture)
    {
        client = fixture.Client;
    }

    [Fact]
    public async Task CreateProfilePersistsItForListing()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        var request = new
        {
            DisplayName = "Blaise",
            TimeZoneId = "Europe/Dublin",
            DailyHydrationGoalMl = 2500,
        };

        var createResponse = await client.PostAsJsonAsync(
            "/api/profiles",
            request,
            cancellationToken);

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createdProfile = await createResponse.Content
            .ReadFromJsonAsync<JsonElement>(cancellationToken);
        var profileId = createdProfile.GetProperty("id").GetGuid();

        Assert.NotEqual(Guid.Empty, profileId);
        Assert.Equal(
            "Blaise",
            createdProfile.GetProperty("displayName").GetString());
        Assert.Equal(
            "Europe/Dublin",
            createdProfile.GetProperty("timeZoneId").GetString());
        Assert.Equal(
            2500,
            createdProfile.GetProperty("dailyHydrationGoalMl").GetInt32());

        var profiles = await client.GetFromJsonAsync<JsonElement>(
            "/api/profiles",
            cancellationToken);
        var persistedProfile = profiles.EnumerateArray().Single(profile =>
            profile.GetProperty("id").GetGuid() == profileId);

        Assert.Equal(
            "Blaise",
            persistedProfile.GetProperty("displayName").GetString());
    }

    [Fact]
    public async Task CreateProfileRejectsInvalidInput()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        object[] invalidRequests =
        [
            new
            {
                DisplayName = " ",
                TimeZoneId = "Europe/Dublin",
                DailyHydrationGoalMl = 2500,
            },
            new
            {
                DisplayName = "Blaise",
                TimeZoneId = "Mars/Olympus_Mons",
                DailyHydrationGoalMl = 2500,
            },
            new
            {
                DisplayName = "Blaise",
                TimeZoneId = "Europe/Dublin",
                DailyHydrationGoalMl = 249,
            },
        ];

        foreach (var request in invalidRequests)
        {
            using var response = await client.PostAsJsonAsync(
                "/api/profiles",
                request,
                cancellationToken);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
