using Domain.Enums;

namespace Application.Common.Interfaces
{
    public interface IUser
    {
        int Id { get; }
        List<Role>? Roles { get; }
    }
}
