//using Domain.Entities;
//using Domain.Entities.Common;
//using Domain.Interfaces.Repositories;
//using Infrastructure.Database;
//using Microsoft.EntityFrameworkCore;

//namespace Infrastructure.Repositories
//{
//    public class ArtistRepository(AppDbContext context) : BaseRepository<User>, IUserRepository
//    {
//        private readonly AppDbContext _context = context;

//        public Task<bool> IsArtistAvailableAsync(int artistId, DateTimeFromTo fromTo, CancellationToken cancellationToken = default)
//        {
//            return Task.FromResult(true);
//        }

//        public Task<bool> IsAnyAvailableAsync(DateTimeFromTo fromTo, CancellationToken cancellationToken = default)
//        {
//            return Task.FromResult(true);
//        }

//        public async Task<User> GetManager(CancellationToken cancellationToken = default)
//        {
//            return await _context.Users.FirstAsync();
//        }
//    }
//}
