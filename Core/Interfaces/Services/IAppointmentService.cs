using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IAppointmentService
    {
        public Task RequestAppointment(Appointment dto);
        public Task ConfirmAppointment(Appointment dto);
    }
}
