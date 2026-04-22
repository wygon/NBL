using Domain.Common;
using Domain.Entities;

namespace Domain.Events
{
    public class AppointmentArtistChangedEvent(Appointment appointment, User? oldArtist, User? newArtist) : BaseEvent
    {
        public Appointment Appointment { get; } = appointment;
        public User? OldArtist { get; } = oldArtist;
        public User? NewArtist { get; } = newArtist;
    }
}
