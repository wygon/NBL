using Domain.Entities;
using Domain.Entities.Common;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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
                .HasConversion<DateTimeFromToConverter>()
                .HasColumnType("jsonb")
                .Metadata.SetValueComparer(new ValueComparer<List<DateTimeFromTo>>(
                    (c1, c2) => c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()
                ));

            builder.HasOne(e => e.Customer)
                .WithMany()
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Artist)
            .WithMany()
            .HasForeignKey(e => e.ArtistId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Service)
                .WithMany()
                .HasForeignKey(e => e.ServiceId)
                .IsRequired();

            builder.HasOne(e => e.Variant)
                .WithMany()
                .HasForeignKey(e => e.VariantId)
                .IsRequired();

            builder.HasMany(e => e.Addons)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "AppointmentAddons", // Nazwa tabeli łączącej w bazie
                j => j.HasOne<Addon>().WithMany().HasForeignKey("AddonId"),
                j => j.HasOne<Appointment>().WithMany().HasForeignKey("AppointmentId")
            );

            builder.Property(e => e.From)
                .HasColumnType("timestamp with time zone");

            builder.Property(e => e.To)
                .HasColumnType("timestamp with time zone");

            builder.Property(e => e.NailSize)
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

            builder.Ignore(e => e.TotalDurationMinutes);
            builder.Ignore(e => e.TotalPrice);
        }
    }
}
