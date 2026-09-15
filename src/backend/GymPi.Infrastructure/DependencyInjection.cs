using GymPi.Application.Profiles;
using GymPi.Infrastructure.Persistence;
using GymPi.Infrastructure.Profiles;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GymPi.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddGymPiInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<GymPiDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("GymPi")
                    ?? throw new InvalidOperationException(
                        "Connection string 'GymPi' is required for persistent features.")));
        services.AddScoped<IProfileStore, PostgresProfileStore>();

        return services;
    }
}
