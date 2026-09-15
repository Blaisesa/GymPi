using GymPi.Infrastructure.Persistence;

using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Testcontainers.PostgreSql;
using Xunit;

namespace GymPi.Api.IntegrationTests.Profiles;

public sealed class PostgresApiFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer database =
        new PostgreSqlBuilder("postgres:18-alpine")
            .Build();

    private HttpClient? client;

    private WebApplicationFactory<Program>? factory;

    public HttpClient Client =>
        client ?? throw new InvalidOperationException("Test fixture is not initialized.");

    public async ValueTask InitializeAsync()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await database.StartAsync(cancellationToken);

        factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
                builder.ConfigureAppConfiguration((_, configuration) =>
                    configuration.AddInMemoryCollection(
                        new Dictionary<string, string?>
                        {
                            ["ConnectionStrings:GymPi"] =
                                database.GetConnectionString(),
                        })));

        client = factory.CreateClient();

        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider
            .GetRequiredService<GymPiDbContext>();
        await dbContext.Database.MigrateAsync(cancellationToken);
    }

    public async ValueTask DisposeAsync()
    {
        client?.Dispose();

        if (factory is not null)
        {
            await factory.DisposeAsync();
        }

        await database.DisposeAsync();
    }
}
