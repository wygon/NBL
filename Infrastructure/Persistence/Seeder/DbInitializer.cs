using Infrastructure.Database;
using System.Reflection;

namespace Infrastructure.Persistence.Seeder
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(AppDbContext context, bool isDevelopment)
        {
            var seederTypes = Assembly.GetExecutingAssembly()
                .GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract && t.IsSubclassOf(typeof(BaseSeeder)));

            List<BaseSeeder> seederInstances = seederTypes
                .Select(type => Activator.CreateInstance(type, context) as BaseSeeder)
                .Where(instance => instance != null)
                .Cast<BaseSeeder>()
                .OrderBy(s => s.Priority)
                .ToList();

            foreach (BaseSeeder seeder in seederInstances)
            {
                seeder.IsDevelopment = isDevelopment;
                await seeder.SeedAsync();
            }

            //await context.SaveChangesAsync(default);
        }
    }
}
