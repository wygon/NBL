using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class AppointmentImageConfiguration : IEntityTypeConfiguration<AppointmentImage>
    {
        public void Configure(EntityTypeBuilder<AppointmentImage> builder)
        {
            builder
                .HasOne<Appointment>()
                .WithMany()
                .HasForeignKey(e => e.AppointmentId)
                .IsRequired();

            builder.Property(e => e.AppointmentId)
                .IsRequired();

            builder.Property(e => e.StoredPath)
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(e => e.OriginalFileName)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(e => e.Label)
                .HasMaxLength(100);

            builder.HasOne(e => e.Appointment)
                .WithMany(a => a.Images)
                .HasForeignKey(e => e.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
