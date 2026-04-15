using Infrastructure.Database;
using Infrastructure.Persistence.Seeder;
using Microsoft.EntityFrameworkCore;

namespace Web.Api.Persistence.Extensions
{
    public static class InitialiserExtensions
    {
        public static async Task InitialiseDatabaseAsync(this WebApplication app, bool isDevelopment)
        {
            using var scope = app.Services.CreateScope();

            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<AppDbContext>();
            var logger = services.GetRequiredService<ILogger<AppDbContext>>();

            try
            {
                if (context.Database.IsNpgsql())
                {
                    await context.Database.MigrateAsync();
                }

                await DbInitializer.SeedAsync(context, isDevelopment);

                logger.LogInformation("Database initialised and seeded successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while initialising the database.");
                throw;
            }
        }
    }
}
