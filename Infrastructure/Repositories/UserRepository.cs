using Domain.Entities;
using Domain.Entities.Common;
using Domain.Enums;
using Domain.Interfaces.Repositories;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public Task<bool> IsArtistAvailableAsync(int artistId, DateTimeFromTo fromTo, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(true);
        }

        public Task<bool> IsAnyAvailableAsync(DateTimeFromTo fromTo, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(true);
        }

        public async Task<User?> GetManager(CancellationToken cancellationToken = default)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Manager, cancellationToken);
        }

        public Task UpdateUser(User user)
        {
            throw new NotImplementedException();
        }

        public async Task<List<User>> GetAllArtistsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Users
                .Where(u => u.Role == UserRole.Artist || u.Role == UserRole.Manager)
                .ToListAsync(cancellationToken);
        }
    }
}
