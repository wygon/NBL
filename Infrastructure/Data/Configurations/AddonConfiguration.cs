using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class AddonConfiguration : IEntityTypeConfiguration<Addon>
    {
        public void Configure(EntityTypeBuilder<Addon> builder)
        {
            builder.Property(s => s.Name)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(a => a.AdditionalPrice)
                .HasPrecision(18, 2);

            builder.Property(a => a.AdditionalDurationMinutes)
                .IsRequired();

        }
    }
}
