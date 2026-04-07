using Domain.Entities.Common;

namespace Domain.Interfaces.Repositories
{
    public interface IArtistRepository
    {
        Task<bool> IsArtistAvailableAsync(int artistId, DateTimeFromTo fromTo, CancellationToken cancellationToken = default);
        Task<bool> IsAnyAvailableAsync(DateTimeFromTo fromTo, CancellationToken cancellationToken = default);
    }
}
