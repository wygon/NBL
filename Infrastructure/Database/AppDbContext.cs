using Application.Common.Interfaces;
using Core.Models;
using Infrastructure.Persistence.Converters;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region User
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.InstagramName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.PhotoUrl)
                    .HasColumnType("text");

                entity.HasMany(u => u.Appointments)
                    .WithOne(a => a.User)
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasQueryFilter(u => !u.IsDeleted);

                entity.HasIndex(u => u.InstagramName)
                    .HasFilter("is_deleted = false")
                    .IsUnique();
            });
            #endregion

            #region Appointment
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.Property(e => e.Status)
                    .HasConversion<AppointmentStatusConverter>()
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.RequestedDates)
                    .HasColumnType("jsonb");

                entity.Property(e => e.NailAddons)
                    .HasColumnType("jsonb");

                entity.Property(e => e.From)
                    .HasColumnType("timestamp with time zone");

                entity.Property(e => e.To)
                    .HasColumnType("timestamp with time zone");

                entity.Property(e => e.NailService)
                    .IsRequired();

                entity.Property(e => e.NailSize)
                    .IsRequired();

                entity.Property(e => e.NailForm)
                    .IsRequired();

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Appointments)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Recipe)
                    .WithMany()
                    .HasForeignKey(e => e.RecipeId);
            });
            #endregion


            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // Sprawdzamy, czy encja dziedziczy po BaseEntity
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    var entity = modelBuilder.Entity(entityType.ClrType);

                    entity.HasQueryFilter(ConvertFilterExpression(entityType.ClrType));

                    entity.HasKey(nameof(BaseEntity.Id));

                    entity.Property(nameof(BaseEntity.CreatedAt)).HasColumnType("timestamp with time zone");
                    entity.Property(nameof(BaseEntity.ModifiedDate)).HasColumnType("timestamp with time zone");
                    entity.Property(nameof(BaseEntity.DeletedDate)).HasColumnType("timestamp with time zone");
                }
            }
        }


        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            UpdateFields();

            var result = await base.SaveChangesAsync(cancellationToken);

            await PublishDomainEvents(cancellationToken);

            return result;
        }


        private void UpdateFields()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach(var entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.ModifiedDate = DateTime.UtcNow;
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entry.Entity.IsDeleted = true;
                        entry.Entity.DeletedDate = DateTime.UtcNow;
                        break;
                }
            }
        }

        private async Task PublishDomainEvents(CancellationToken cancellationToken)
        {
            var entitiesWithEvents = ChangeTracker.Entries<BaseEntity>()
                .Select(e => e.Entity)
                .Where(e => e.DomainEvents.Any())
                .ToList();

            foreach(var entity in entitiesWithEvents)
            {
                var events = entity.DomainEvents.ToList();

                entity.ClearDomainEvents();

                foreach(var domainEvent in events)
                {
                    await _mediator.Publish(domainEvent, cancellationToken);
                }
            }
        }
        
        private static LambdaExpression ConvertFilterExpression(Type type)
        {
            var parameter = Expression.Parameter(type, "e");
            var property = Expression.Property(parameter, "IsDeleted");
            var notExpression = Expression.Not(property);
            return Expression.Lambda(notExpression, parameter);
        }

    }
}
