using Core.Models;
using MediatR;

namespace Core.Events
{
    public class AppointmentConfirmedEvent(Appointment appointment) : INotification
    {
        public Appointment Appointment { get; } = appointment;
    }
}
