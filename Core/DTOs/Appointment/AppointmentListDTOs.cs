using Core.Models.Common;
using Core.Models.Statuses;

namespace Core.DTOs.Appointment
{
    public class AppointmentListDTOs
    {
        public required int Id { get; set; }
        public required List<DateTimeFromTo> RequestedDates { get; set; }
        public required AppointmentStatus Status { get; set; }
    }
}
