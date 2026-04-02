using Application.Common.Interfaces;
using Domain.Enums;
using System.Security.Claims;

namespace Web.Api.Services
{
    public class CurrentUser : IUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        //TODO: weryfikacja
        //VERIFY
        public int? Id
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
                throw new UnauthorizedAccessException("Brak identyfikatora użytkownika w tokenie.");
            }
        }

        public List<Role>? Roles => throw new NotImplementedException();
    }
}
