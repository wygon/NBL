using Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Web.Api.Services
{
    public class CurrentUser : IIdentityProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAuthorizationService _authorizationService;

        public CurrentUser(IHttpContextAccessor httpContextAccessor, IAuthorizationService authorizationService)
        {
            _httpContextAccessor = httpContextAccessor;
            _authorizationService = authorizationService;
        }

        public int UserId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;

                // 1. Sprawdzamy, czy request w ogóle przeszedł przez autoryzację
                if (user == null || user.Identity == null || !user.Identity.IsAuthenticated)
                {
                    return 0;
                    throw new UnauthorizedAccessException("Próba pobrania UserId z niezalogowanego żądania. Dodaj [Authorize] do kontrolera!");
                }

                // 2. Skoro jest zalogowany, szukamy ID
                var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

                if (int.TryParse(idClaim, out int userId))
                {
                    return userId;
                }

                return 0;
                throw new UnauthorizedAccessException("Token jest poprawny, ale nie zawiera claima NameIdentifier.");
            }
        }

        public string? Username => _httpContextAccessor.HttpContext?.User?.Identity?.Name;

        public string? UserRole => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

        public bool IsInRole(string roleName) =>
            _httpContextAccessor.HttpContext?.User?.IsInRole(roleName) ?? false;

        public bool HasClaim(string claimType, string claimValue) =>
            _httpContextAccessor.HttpContext?.User?.HasClaim(claimType, claimValue) ?? false;

        public string? GetClaimValue(string claimType) =>
            _httpContextAccessor.HttpContext?.User?.FindFirstValue(claimType);

        public async Task<bool> AuthorizeAsync(string policyName)
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user == null) return false;

            var result = await _authorizationService.AuthorizeAsync(user, policyName);

            return result.Succeeded;
        }

    }
}
