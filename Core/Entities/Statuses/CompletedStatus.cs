namespace Domain.Entities.Statuses
{
    public sealed class CompletedStatus : AppointmentStatus
    {
        public CompletedStatus()
        {
            CanCancel = false;
            CanConfirm = false;
            CanComplete = false;
        }
        public override void Cancel(Appointment appointment)
        {
            throw new InvalidOperationException("You can't cancel appointment that was completed.");
        }

        public override void Complete(Appointment appointment)
        {
            throw new InvalidOperationException("You can't complete appointment that was completed.");
        }

        public override void Confirm(Appointment appointment)
        {
            throw new InvalidOperationException("You can't confirm appointment that was completed.");
        }
    }
}
