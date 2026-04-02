using Domain.Entities.Common;
using Domain.Entities.Statuses;

namespace Domain.DTOs.Appointment
{
    public class AppointmentListDTOs
    {
        public required int Id { get; set; }
        public required List<DateTimeFromTo> RequestedDates { get; set; }
        public required AppointmentStatus Status { get; set; }
    }
}
