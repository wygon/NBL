using Bogus;
using Domain.Entities;
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
            if (_context.Users.Any()) return;

            var userFaker = new Faker<User>()
                .RuleFor(u => u.Name, f => f.Person.FirstName)
                .RuleFor(u => u.InstagramName, f => f.Internet.UserName())
                .RuleFor(u => u.PhoneNumber, f => f.Person.Phone)
                .RuleFor(u => u.PhotoUrl, f => f.Internet.Avatar())
                .RuleFor(u => u.Email, f => f.Internet.Email());

            List<User> users = new List<User>();

            users.Add(new User()
            {
                Name = "Admin",
                PhoneNumber = "1234567890",
                InstagramName = "wygon_",
                PhotoUrl = "",
                Email = "szymon302.sws@gmail.com"
            });

            users.AddRange(userFaker.Generate(10));

            _context.Users.AddRange(users);

            await _context.SaveChangesAsync(default);
        }
    }
}
