using Domain.Entities;

namespace Domain.Interfaces.Repositories
{
    public interface IAppointmentRepository
    {
        Task AddAppointment(Appointment appointment);
        Task<List<Appointment>> GetAppointments();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
