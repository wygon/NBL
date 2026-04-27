using Bogus;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Database;

namespace Infrastructure.Persistence.Seeder
{
    public class UserSeeder : BaseSeeder
    {
        public UserSeeder(AppDbContext context) : base(context)
        {

        }

        public override int Priority => 1;

        public override async Task SeedAsync()
        {
            List<User> usersToSeed = new List<User>();

            if (!_context.Users.Any(u => u.Role == UserRole.User))
            {
                if (IsDevelopment)
                {
                    var userFaker = new Faker<User>()
                        .RuleFor(u => u.Name, f => f.Person.FirstName)
                        .RuleFor(u => u.InstagramName, f => f.Internet.UserName())
                        .RuleFor(u => u.PhoneNumber, f => f.Person.Phone)
                        .RuleFor(u => u.PhotoUrl, f => f.Internet.Avatar())
                        .RuleFor(u => u.Email, f => f.Internet.Email())
                        .RuleFor(u => u.Role, UserRole.User);

                    usersToSeed.AddRange(userFaker.Generate(2));
                }
            }

            if (!_context.Users.Any(u => u.Role == UserRole.Manager))
            {
                usersToSeed.Add(new User()
                {
                    Name = "Wygon",
                    PhoneNumber = "1234567890",
                    InstagramName = "wygon_",
                    PhotoUrl = "",
                    Email = "szymon302.sws@gmail.com",
                    Role = UserRole.Manager
                });
            }

            if (!_context.Users.Any(u => u.Role == UserRole.Artist))
            {
                usersToSeed.Add(new User()
                {
                    Name = "Zuza",
                    PhoneNumber = "1234567890",
                    InstagramName = "nbl_",
                    PhotoUrl = "",
                    Email = "x@gmail.com",
                    Role = UserRole.Artist
                });

                if (IsDevelopment)
                {
                    var artistFaker = new Faker<User>()
                           .RuleFor(u => u.Name, f => f.Person.FirstName)
                           .RuleFor(u => u.InstagramName, f => f.Internet.UserName())
                           .RuleFor(u => u.PhoneNumber, f => f.Person.Phone)
                           .RuleFor(u => u.PhotoUrl, f => f.Internet.Avatar())
                           .RuleFor(u => u.Email, f => f.Internet.Email())
                           .RuleFor(u => u.Role, UserRole.Artist);

                    usersToSeed.AddRange(artistFaker.Generate(0));
                }
            }

            if (usersToSeed.Any())
            {
                _context.Users.AddRange(usersToSeed);
                await _context.SaveChangesAsync();
            }
        }
    }
}
