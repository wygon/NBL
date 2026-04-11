namespace Domain.Entities.Statuses
{
    public sealed class ExpiredStatus : AppointmentStatus
    {
        public ExpiredStatus()
        {
            CanCancel = false;
            CanConfirm = false;
            CanComplete = false;
        }
        public override void Cancel(Appointment appointment)
        {
            throw new InvalidOperationException("You can't cancel appointment that is expired.");
        }

        public override void Complete(Appointment appointment)
        {
            throw new InvalidOperationException("You can't cancel appointment that is expired.");
        }

        public override void Confirm(Appointment appointment)
        {
            throw new InvalidOperationException("You can't complete appointment that was completed.");
        }
    }
}
