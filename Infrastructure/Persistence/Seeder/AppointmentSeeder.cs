using Bogus;
using Domain.Entities;
using Domain.Entities.Common;
using Infrastructure.Database;

namespace Infrastructure.Persistence.Seeder
{
    public class AppointmentSeeder : BaseSeeder
    {
        public AppointmentSeeder(AppDbContext context) : base(context) { }
        public override int Priority => 4;

        public override async Task SeedAsync()
        {
            if (_context.Appointments.Any()) return;
            if (!IsDevelopment) return;

            var users = _context.Users.ToList();
            var services = _context.Services.ToList();
            var variants = _context.Variants.ToList();

            if (!users.Any() || !services.Any())
            {
                Console.WriteLine("Skonfiguruj najpierw Seeder dla User i Service!");
                return;
            }

            var staff = users.Where(u => u.Role == Domain.Enums.UserRole.Artist ||
                                         u.Role == Domain.Enums.UserRole.Manager).ToList();

            var availableArtists = staff.Any() ? staff : users;

            var appointmentFaker = new Faker<Appointment>()
                .CustomInstantiator(f =>
                {
                    var artist = f.PickRandom(availableArtists);
                    var customer = f.PickRandom(users);
                    var service = f.PickRandom(services);

                    var start = DateTime.UtcNow.AddDays(f.Random.Int(1, 10));
                    var end = start.AddHours(2);

                    var app = Appointment.RequestAppointment(
                        artist.Id,
                        customer.Id,
                        new List<DateTimeFromTo> {
                    new DateTimeFromTo(start, end)
                        },
                        service,
                        f.PickRandom<Domain.Enums.NailSize>(),
                        variants.Any() ? f.PickRandom(variants) : null,
                        _context.Addons.Take(2).ToList(),
                        f.Lorem.Sentence()
                    );
                    return app;
                });

            var appointments = appointmentFaker.Generate(20);
            _context.Appointments.AddRange(appointments);

            await _context.SaveChangesAsync();
        }
    }
}
