using GymPi.Api.Health;

using Microsoft.AspNetCore.Diagnostics.HealthChecks;

// Configures the GymPi HTTP host and its operational health endpoint.
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();

var app = builder.Build();

app.MapHealthChecks(
    "/api/health",
    new HealthCheckOptions
    {
        ResponseWriter = (context, report) => context.Response.WriteAsJsonAsync(
            new SystemHealthResponse(report.Status.ToString().ToLowerInvariant())),
    });

app.Run();

// Makes the generated Program type available to the integration-test host.
public partial class Program
{
}
