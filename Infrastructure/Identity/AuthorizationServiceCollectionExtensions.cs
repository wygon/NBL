using Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Identity;

public static class AuthorizationServiceCollectionExtensions
{
    public static IServiceCollection AddAppAuthorization(this IServiceCollection services)
    {
        services.AddSingleton<IAuthorizationHandler, AdminRequirementHandler>();

        services.AddAuthorization(options =>
        {
            options.AddPolicy(Policies.AdminOnly, policy =>
                policy.RequireRole(Roles.Admin));

            options.AddPolicy(Policies.CanManageAppointments, policy =>
                policy.RequireRole(Roles.Admin, Roles.Manager));

            options.AddPolicy(Policies.Artist, policy =>
                policy.RequireRole(Roles.Artist, Roles.Manager));

            options.AddPolicy(Policies.User, policy =>
                policy.RequireRole(Roles.VipUser, Roles.User));


            options.AddPolicy(Policies.AtLeast18, policy =>
                policy.RequireClaim("Age", "18", "19", "20"));
        });

        return services;
    }
}