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

            var random = new Random();
            var users = _context.Users.ToList();
            var services = _context.Services.ToList();
            var addons = _context.Addons.ToList();
            var variants = _context.Variants.ToList();

            var appointmentFaker = new Faker<Appointment>()
                .CustomInstantiator(f =>
                {
                    var artist = users[0]; // Admin jako artysta
                    var customer = f.PickRandom(users.Skip(1));
                    var service = f.PickRandom(services);

                    // Używamy metody fabrycznej, którą stworzyliśmy
                    var app = Appointment.RequestAppointment(
                        artist.Id,
                        customer.Id,
                        new List<DateTimeFromTo> {
                            new DateTimeFromTo(DateTime.UtcNow.AddDays(f.Random.Int(1, 10)), DateTime.UtcNow.AddDays(11))
                        },
                        service,
                        f.PickRandom<Domain.Enums.NailSize>(),
                        f.PickRandom(variants),
                        f.PickRandom(addons, 2), // Wybierz 2 losowe dodatki
                        f.Lorem.Sentence()
                    );
                    return app;
                });

            var appointments = appointmentFaker.Generate(5);
            _context.Appointments.AddRange(appointments);

            await _context.SaveChangesAsync();
        }
    }
}
