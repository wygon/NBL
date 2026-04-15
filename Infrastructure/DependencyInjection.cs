using Domain.Interfaces.Repositories;
using Infrastructure.Data.Interceptors;
using Infrastructure.Database;
using Infrastructure.Identity;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton(TimeProvider.System);

            services.AddScoped<AuditableEntityInterceptor>();

            services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IArtistRepository, ArtistRepository>();
            services.AddScoped<IServiceRepository, ServiceRepository>();
            services.AddScoped<IVariantRepository, VariantRepository>();
            services.AddScoped<IAddonRepository, AddonRepository>();

            //builder.Services.AddAuthentication(options =>
            //{
            //    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = InstagramAuthenticationDefaults.AuthenticationScheme;
            //})
            //.AddCookie() // Instagram potrzebuje ciasteczka, by "pamiętać" stan logowania
            //.AddInstagram(options =>
            //{
            //    options.ClientId = builder.Configuration["Instagram:ClientId"];
            //    options.ClientSecret = builder.Configuration["Instagram:ClientSecret"];
            //    options.SaveTokens = true; // Zapisze AccessToken Instagrama w Claimsach
            //});

            services.AddAppAuthorization();

            services.AddDbContext<AppDbContext>((sp, options) =>
            {
                var auditableInterceptor = sp.GetRequiredService<AuditableEntityInterceptor>();
                options.UseNpgsql(config.GetConnectionString("PostgresConnection"))
                .UseSnakeCaseNamingConvention()
                .AddInterceptors(auditableInterceptor);
            });

            return services;
        }
    }
}
