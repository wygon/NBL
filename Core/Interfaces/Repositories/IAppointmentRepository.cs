using Domain.Common.Filters;
using Domain.Entities;

namespace Domain.Interfaces.Repositories
{
    public interface IAppointmentRepository
    {
        Task AddAppointment(Appointment appointment);
        Task<Appointment> GetAppointment(int id, CancellationToken cancellationToken = default);
        Task<(List<Appointment> Appointments, int TotalCount)> GetAppointmentsAsync(AppointmentFilter filters, CancellationToken cancellationToken = default);
        void DeleteAppointment(Appointment appointment, CancellationToken cancellationToken = default);
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
