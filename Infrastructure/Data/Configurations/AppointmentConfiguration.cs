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
                .HasConversion<DateTimeFromToConverter>()
                .HasColumnType("jsonb");

            builder.Property(e => e.NailAddons)
                .HasConversion<NailAddonsConverter>()
                .HasColumnType("jsonb");

            builder.Property(e => e.From)
                .HasColumnType("timestamp with time zone");

            builder.Property(e => e.To)
                .HasColumnType("timestamp with time zone");

            builder.Property(e => e.NailService)
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(e => e.NailSize)
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(e => e.NailForm)
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

            //Verify: podobno nie trzeba, bo EF Core sam wykrywa relacje na podstawie konwencji nazewnictwa i typów danych.
            //Ale zostawiam to na razie, bo może być potrzebne do poprawnego działania.
            //builder.HasOne(e => e.Customer)
            //    .WithMany(u => u.Appointments)
            //    //.WithMany()
            //    .HasForeignKey(e => e.UserId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //builder.HasOne(e => e.Recipe)
            //    .WithMany()
            //    .HasForeignKey(e => e.RecipeId);
        }
    }
}
