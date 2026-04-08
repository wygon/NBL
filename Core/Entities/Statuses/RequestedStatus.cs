namespace Domain.Entities.Statuses
{
    public class RequestedStatus : AppointmentStatus
    {
        public RequestedStatus()
        {
            CanCancel = true;
            CanConfirm = true;
            CanComplete = false;
        }
        public override void Cancel(Appointment appointment)
        {
            appointment.TransitionTo(new CancelledStatus());
        }

        public override void Complete(Appointment appointment)
        {
            throw new InvalidOperationException("You can't complete appointment that was not confirmed.");
        }

        public override void Confirm(Appointment appointment)
        {
            appointment.TransitionTo(new ConfirmedStatus());

            //W glownej encji
            //appointment.AddDomainEvent(new AppointmentConfirmedEvent(appointment));
        }
    }
}
