using Domain.Common;
using Domain.Entities;
using Infrastructure.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Database
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        private IMediator _mediator;
        public AppDbContext(DbContextOptions<AppDbContext> options, IMediator mediator) : base(options)
        {
            _mediator = mediator;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentImage> AppointmentImages { get; set; }
        public DbSet<Addon> Addons { get; set; }
        public DbSet<Variant> Variants { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await PublishDomainEvents(cancellationToken);

            int result = await base.SaveChangesAsync(cancellationToken);

            return result;
        }


        [Obsolete("Należy wykorzystać lepszą opcję")]
        private async Task PublishDomainEvents(CancellationToken cancellationToken)
        {
            var entitiesWithEvents = ChangeTracker.Entries<BaseEntity>()
                .Select(e => e.Entity)
                .Where(e => e.DomainEvents.Any())
                .ToList();

            foreach (var entity in entitiesWithEvents)
            {
                var events = entity.DomainEvents.ToList();

                entity.ClearDomainEvents();

                foreach (var domainEvent in events)
                {
                    await _mediator.Publish(domainEvent, cancellationToken);
                }
            }
        }
    }
}
