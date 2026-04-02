using Domain.Entities;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.Property(e => e.Status)
                .HasConversion<AppointmentStatusConverter>()
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(e => e.RequestedDates)
                .HasColumnType("jsonb");

            builder.Property(e => e.NailAddons)
                .HasColumnType("jsonb");

            builder.Property(e => e.From)
                .HasColumnType("timestamp with time zone");

            builder.Property(e => e.To)
                .HasColumnType("timestamp with time zone");

            builder.Property(e => e.NailService)
                .IsRequired();

            builder.Property(e => e.NailSize)
                .IsRequired();

            builder.Property(e => e.NailForm)
                .IsRequired();

            builder.HasOne(e => e.Customer)
                .WithMany(u => u.Appointments)
                //.WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Recipe)
                .WithMany()
                .HasForeignKey(e => e.RecipeId);
        }
    }
}
