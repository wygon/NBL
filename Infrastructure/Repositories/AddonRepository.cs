using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    public class AddonRepository : BaseRepository<Addon>, IAddonRepository
    {
        public AddonRepository(AppDbContext context) : base(context) { }
    }
}
