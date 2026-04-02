using Domain.Entities;

namespace Domain.Entities.Statuses
{
    public class ConfirmedStatus : AppointmentStatus
    {
        public ConfirmedStatus()
        {
            CanCancel = true;
            CanConfirm = false;
            CanComplete = true;
        }
        public override void Cancel(Appointment appointment)
        {
            appointment.TransitionTo(new CancelledStatus());
        }

        public override void Complete(Appointment appointment)
        {
            appointment.TransitionTo(new CompletedStatus());
        }

        public override void Confirm(Appointment appointment)
        {
            throw new NotImplementedException();
        }
    }
}
