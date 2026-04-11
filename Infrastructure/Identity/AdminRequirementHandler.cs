using Domain.Constants;
using Microsoft.AspNetCore.Authorization;

namespace Infrastructure.Identity
{
    public class AdminRequirementHandler : IAuthorizationHandler
    {
        public Task HandleAsync(AuthorizationHandlerContext context)
        {
            if (context.User.Identity is { IsAuthenticated: true } && context.User.IsInRole(Roles.Admin))
            {
                foreach (var requirement in context.PendingRequirements.ToList())
                {
                    context.Succeed(requirement);
                }
            }

            return Task.CompletedTask;
        }
    }
}
