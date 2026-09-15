using GymPi.Api.Health;
using GymPi.Api.Hydration;
using GymPi.Api.Profiles;
using GymPi.Application.Hydration;
using GymPi.Application.Profiles;
using GymPi.Infrastructure;

using Microsoft.AspNetCore.Diagnostics.HealthChecks;

// Configures the GymPi HTTP host and its operational health endpoint.
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<CreateProfileHandler>();
builder.Services.AddScoped<ListProfilesHandler>();
builder.Services.AddScoped<RecordHydrationHandler>();
builder.Services.AddScoped<GetHydrationHandler>();
builder.Services.AddGymPiInfrastructure(builder.Configuration);

var app = builder.Build();

app.MapHealthChecks(
    "/api/health",
    new HealthCheckOptions
    {
        ResponseWriter = (context, report) => context.Response.WriteAsJsonAsync(
            new SystemHealthResponse(report.Status.ToString().ToLowerInvariant())),
    });
app.MapProfileEndpoints();
app.MapHydrationEndpoints();

app.Run();

// Makes the generated Program type available to the integration-test host.
public partial class Program
{
}
