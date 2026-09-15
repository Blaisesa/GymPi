using GymPi.Application.Profiles;

namespace GymPi.Api.Profiles;

public static class ProfileEndpoints
{
    public static IEndpointRouteBuilder MapProfileEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/profiles");

        group.MapGet("", ListProfilesAsync);
        group.MapPost("", CreateProfileAsync);

        return endpoints;
    }

    private static async Task<IResult> ListProfilesAsync(
        ListProfilesHandler handler,
        CancellationToken cancellationToken)
    {
        var profiles = await handler.HandleAsync(cancellationToken);
        return Results.Ok(profiles);
    }

    private static async Task<IResult> CreateProfileAsync(
        CreateProfileRequest request,
        CreateProfileHandler handler,
        CancellationToken cancellationToken)
    {
        try
        {
            var profile = await handler.HandleAsync(
                new CreateProfileCommand(
                    request.DisplayName,
                    request.TimeZoneId,
                    request.DailyHydrationGoalMl),
                cancellationToken);

            return Results.Json(profile, statusCode: StatusCodes.Status201Created);
        }
        catch (ArgumentException exception) when (exception.ParamName is not null)
        {
            return Results.ValidationProblem(
                new Dictionary<string, string[]>
                {
                    [exception.ParamName] = [exception.Message],
                });
        }
    }

    private sealed record CreateProfileRequest(
        string DisplayName,
        string TimeZoneId,
        int DailyHydrationGoalMl);
}
