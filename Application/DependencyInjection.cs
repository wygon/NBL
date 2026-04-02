using Application.Common.Behaviors;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            var assembly = typeof(DependencyInjection).Assembly;

            services.AddMediatR(configuration =>
            {
                configuration.RegisterServicesFromAssemblies(assembly);
                configuration.AddOpenBehavior(typeof(ValidationBehavior<,>));
            });

            return services;
        }
    }
}
