using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    public class VariantRepository : BaseRepository<Variant>, IVariantRepository
    {
        public VariantRepository(AppDbContext context) : base(context) { }
    }
}
