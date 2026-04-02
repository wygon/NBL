using Domain.Entities.Common;

namespace Domain.Interfaces.Repositories
{
    public interface IArtistRepository
    {
        Task<bool> IsAvailableAsync(int artistId, DateTimeFromTo fromTo, CancellationToken cancellationToken = default);
    }
}
