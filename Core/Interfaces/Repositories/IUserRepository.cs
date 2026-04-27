using Domain.Entities;
using Domain.Entities.Common;

namespace Domain.Interfaces.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<bool> IsArtistAvailableAsync(int artistId, DateTimeFromTo fromTo, CancellationToken cancellationToken = default);
        Task<bool> IsAnyAvailableAsync(DateTimeFromTo fromTo, CancellationToken cancellationToken = default);
        Task<User> GetManager(CancellationToken cancellationToken = default);
        Task<List<User>> GetAllArtistsAsync(CancellationToken cancellationToken = default);
        Task<User> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    }
}
