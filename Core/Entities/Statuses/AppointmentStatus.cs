using Domain.Entities;

namespace Domain.Entities.Statuses
{
    public abstract class AppointmentStatus
    {
        public bool CanCancel { get; init; }
        public bool CanConfirm { get; init; }
        public bool CanComplete { get; init; }
        public abstract void Cancel(Appointment appointment);
        public abstract void Confirm(Appointment appointment);
        public abstract void Complete(Appointment appointment);
    }
}
