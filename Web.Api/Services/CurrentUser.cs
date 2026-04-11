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

        //TODO: weryfikacja
        //VERIFY
        public int UserId
        {
            get
            {
                // Wyciągamy ID z tokena (zazwyczaj zapisane pod NameIdentifier)
                var idClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (int.TryParse(idClaim, out int userId))
                {
                    return userId;
                }

                // Jeśli ktoś ma token, ale nie ma w nim ID, to coś jest grubo nie tak z konfiguracją JWT
                //throw new UnauthorizedAccessException("Brak identyfikatora użytkownika w tokenie.");

                return 1;
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

            // Tutaj dzieje się magia: silnik sprawdza wszystkie wymagania polityki
            var result = await _authorizationService.AuthorizeAsync(user, policyName);

            return result.Succeeded;
        }

    }
}
