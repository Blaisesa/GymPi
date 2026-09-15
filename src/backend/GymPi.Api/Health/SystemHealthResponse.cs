namespace GymPi.Api.Health;

/// Represents the intentionally small public response returned by the health endpoint.
internal sealed record SystemHealthResponse(string Status);
