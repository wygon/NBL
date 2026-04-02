using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(e => e.InstagramName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.PhotoUrl)
                .HasColumnType("text");

            builder.HasMany(u => u.Appointments)
                .WithOne(a => a.Customer)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasQueryFilter(u => !u.IsDeleted);

            builder.HasIndex(u => u.InstagramName)
                .HasFilter("is_deleted = false")
                .IsUnique();
        }
    }
}
