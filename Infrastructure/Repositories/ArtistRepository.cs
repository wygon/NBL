using Domain.Entities.Common;
using Domain.Interfaces.Repositories;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    public class ArtistRepository(AppDbContext context) : IArtistRepository
    {
        private readonly AppDbContext _context = context;

        public Task<bool> IsArtistAvailableAsync(int artistId, DateTimeFromTo fromTo, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(true);
        }

        public Task<bool> IsAnyAvailableAsync(DateTimeFromTo fromTo, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(true);
        }
    }
}
