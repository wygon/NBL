using Domain.Entities.Statuses;
using Infrastructure.Persistence.Factories;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Persistence.Converters
{
    public class AppointmentStatusConverter : ValueConverter<AppointmentStatus, string>
    {
        public AppointmentStatusConverter() 
            : base(
            v => v.GetType().Name,
            v => AppointmentStatusFactory.Create(v)) { }
    }
}
