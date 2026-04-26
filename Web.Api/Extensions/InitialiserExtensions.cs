using Infrastructure.Database;
using Infrastructure.Persistence.Seeder;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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
                for (int i = 0; i < 5; i++)
                {
                    try
                    {
                        if (context.Database.IsNpgsql())
                        {
                            await context.Database.MigrateAsync();
                            logger.LogInformation("Database initialised and seeded successfully.");
                        }
                    }
                    catch (NpgsqlException ex)
                    {
                        logger.LogError(ex, "An error occurred while initialising the database.");
                        if (i == 4) throw; // Jeśli to 5 próba, poddajemy się
                        await Task.Delay(5000); // Czekaj 5 sekund przed kolejną próbą
                    }
                }

                await DbInitializer.SeedAsync(context, isDevelopment);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
