using Infrastructure.Database;

namespace Infrastructure.Persistence.Seeder
{
    public abstract class BaseSeeder
    {
        protected AppDbContext _context { get; }
        public abstract int Priority { get; }
        protected BaseSeeder(AppDbContext context)
        {
            _context = context;
        }

        public abstract Task SeedAsync();
    }
}
