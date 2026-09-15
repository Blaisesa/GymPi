using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace GymPi.Api.IntegrationTests.Health;

public sealed class HealthEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient client;

    public HealthEndpointTests(WebApplicationFactory<Program> factory)
    {
        client = factory.CreateClient();
    }

    [Fact]
    public async Task GetHealthReturnsHealthyStatusWhenApiIsRunning()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        var response = await client.GetAsync("/api/health", cancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        var payload = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken);

        Assert.Equal("healthy", payload.GetProperty("status").GetString());
        Assert.Single(payload.EnumerateObject());
    }
}
