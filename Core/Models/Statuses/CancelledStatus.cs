namespace Core.Models.Statuses
{
    public class CancelledStatus : AppointmentStatus
    {
        public CancelledStatus()
        {
            CanCancel = false;
            CanConfirm = false;
            CanComplete = false;
        }
        public override void Cancel(Appointment appointment)
        {
            throw new InvalidOperationException("Appointment was cancelled yet.");
        }

        public override void Complete(Appointment appointment)
        {
            throw new InvalidOperationException("You can't complete cancelled appointment.");
        }

        public override void Confirm(Appointment appointment)
        {
            throw new InvalidOperationException("You can't confirm cancelled appointment.");
        }
    }
}
