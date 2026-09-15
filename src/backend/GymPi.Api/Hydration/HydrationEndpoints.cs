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
            "/api/profiles/{profileId:guid}/hydration-overview",
            GetHydrationOverviewAsync);

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

    private static async Task<IResult> GetHydrationOverviewAsync(
        Guid profileId,
        GetHydrationOverviewHandler handler,
        CancellationToken cancellationToken)
    {
        try
        {
            var overview = await handler.HandleAsync(
                profileId,
                cancellationToken);

            return Results.Ok(overview);
        }
        catch (KeyNotFoundException)
        {
            return Results.NotFound();
        }
    }

    private sealed record RecordHydrationRequest(int AmountMl);
}
