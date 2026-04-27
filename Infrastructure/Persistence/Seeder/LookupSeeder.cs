using Domain.Entities;
using Infrastructure.Database;

namespace Infrastructure.Persistence.Seeder
{
    public class LookupSeeder : BaseSeeder
    {
        public LookupSeeder(AppDbContext context) : base(context) { }
        public override int Priority => 3;

        public override async Task SeedAsync()
        {
            if (_context.Addons.Any()) return;

            if (!_context.Addons.Any())
            {
                _context.Addons.AddRange(new List<Addon>
                {
                    new Addon("French", 20, 15),
                    new Addon("Cyrkonie", 10, 10),
                    new Addon("Zdobienia ręczne", 30, 20),
                    new Addon("Pyłek/Efekt", 15, 5)
                });

                if (IsDevelopment)
                {
                    _context.Addons.AddRange(new List<Addon>
                    {
                        new Addon("User_Skibi", 50, 15),
                        new Addon("User_Dibi", 35, 5)
                    });
                }
            }

            if (!_context.Variants.Any())
            {
                _context.Variants.AddRange(new List<Variant>
                {
                    new Variant("Migdał"),
                    new Variant("Kwadrat"),
                    new Variant("Owal"),
                    new Variant("Ballerina")
                });

                if (IsDevelopment)
                {
                    _context.Variants.AddRange(new List<Variant>
                    {
                        new Variant("User_Boks"),
                        new Variant("User_Stop")
                    });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
