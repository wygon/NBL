using Domain.Common;
using Domain.Entities;

namespace Domain.Events
{
    public class AppointmentFinishedNotification(Appointment appointment) : BaseEvent
    {
        public Appointment Appointment { get; } = appointment;
    }
}
