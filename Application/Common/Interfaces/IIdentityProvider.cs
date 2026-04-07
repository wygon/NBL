using Domain.Enums;

namespace Application.Common.Interfaces
{
    public interface IIdentityProvider
    {
        int UserId { get; }
        List<Role>? Roles { get; }
    }
}
