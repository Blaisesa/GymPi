using GymPi.Application.Hydration;

namespace GymPi.Api.Hydration;

public static class HydrationEndpoints
{
    public static IEndpointRouteBuilder MapHydrationEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost(
            "/api/profiles/{profileId:guid}/hydration-entries",
            RecordHydrationAsync);
        endpoints.MapGet(
            "/api/profiles/{profileId:guid}/hydration",
            GetHydrationAsync);

        return endpoints;
    }

    private static async Task<IResult> RecordHydrationAsync(
        Guid profileId,
        RecordHydrationRequest request,
        RecordHydrationHandler handler,
        CancellationToken cancellationToken)
    {
        try
        {
            var entry = await handler.HandleAsync(
                new RecordHydrationCommand(profileId, request.AmountMl),
                cancellationToken);

            return Results.Json(entry, statusCode: StatusCodes.Status201Created);
        }
        catch (ArgumentException exception) when (exception.ParamName is not null)
        {
            return Results.ValidationProblem(
                new Dictionary<string, string[]>
                {
                    [exception.ParamName] = [exception.Message],
                });
        }
        catch (KeyNotFoundException)
        {
            return Results.NotFound();
        }
    }

    private static async Task<IResult> GetHydrationAsync(
        Guid profileId,
        int? days,
        GetHydrationHandler handler,
        CancellationToken cancellationToken)
    {
        try
        {
            var hydration = await handler.HandleAsync(
                profileId,
                days ?? GetHydrationHandler.DefaultDays,
                cancellationToken);

            return Results.Ok(hydration);
        }
        catch (ArgumentException exception) when (exception.ParamName is not null)
        {
            return Results.ValidationProblem(
                new Dictionary<string, string[]>
                {
                    [exception.ParamName] = [exception.Message],
                });
        }
        catch (KeyNotFoundException)
        {
            return Results.NotFound();
        }
    }

    private sealed record RecordHydrationRequest(int AmountMl);
}
