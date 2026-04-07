using Application.Common.Behaviors;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            var assembly = typeof(IApplicationAssemblyMarker).Assembly;

            services.AddValidatorsFromAssembly(assembly);

            services.AddMediatR(configuration =>
            {
                configuration.RegisterServicesFromAssemblies(assembly);
                configuration.AddOpenBehavior(typeof(ValidationBehavior<,>));
            });

            services.AddAutoMapper(config =>
            {
                config.AllowNullCollections = true;
                config.AddMaps(assembly);
            });

            return services;
        }
    }
}
