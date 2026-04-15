using Domain.Entities;
using Infrastructure.Database;

namespace Infrastructure.Persistence.Seeder
{
    public class ServiceSeeder : BaseSeeder
    {
        public ServiceSeeder(AppDbContext context) : base(context) { }
        public override int Priority => 2;

        public override async Task SeedAsync()
        {
            if (_context.ServiceCategories.Any()) return;

            var catNails = new ServiceCategory("Paznokcie", "Stylizacja i pielęgnacja dłoni", isSystem: true);
            var catPedicure = new ServiceCategory("Pedicure", "Zabiegi na stopy", isSystem: true);

            _context.ServiceCategories.AddRange(catNails, catPedicure);
            await _context.SaveChangesAsync();

            // 2. Tworzymy Usługi przypisane do kategorii
            var services = new List<Service>
            {
                new Service("Manicure Hybrydowy", "Klasyczna hybryda", 120, 90, catNails.Id),
                new Service("Żel - Naturalna Płytka", "Wzmocnienie żelem", 150, 120, catNails.Id),
                new Service("Przedłużenie Żelowe", "Przedłużanie na formie", 180, 150, catNails.Id),
                new Service("Pedicure Frezarkowy", "Opracowanie stopy i malowanie", 140, 90, catPedicure.Id)
            };

            if (IsDevelopment)
            {
                services.Add(new Service("User_Manicure Klasyczny", "Tradycyjny manicure", 80, 60, catNails.Id));
                services.Add(new Service("User_Pedicure Klasyczny", "Tradycyjny pedicure", 100, 75, catPedicure.Id));
            }

            _context.Services.AddRange(services);
            await _context.SaveChangesAsync();
        }
    }
}
