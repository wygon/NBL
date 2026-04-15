using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class ServiceConfiguration : IEntityTypeConfiguration<Service>
    {
        public void Configure(EntityTypeBuilder<Service> builder)
        {
            builder.Property(s => s.Name)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(s => s.Description)
                .HasMaxLength(512);

            builder.Property(s => s.DefaultDurationInMinutes)
                .IsRequired();

            builder.Property(s => s.DefaultPrice)
                .HasPrecision(18, 2);

            builder.Property(s => s.IsActive)
                .IsRequired();

            builder.HasOne<ServiceCategory>()
                .WithMany(c => c.Services)
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(s => s.Category)
               .WithMany(c => c.Services)
               .HasForeignKey(s => s.CategoryId)
               .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
