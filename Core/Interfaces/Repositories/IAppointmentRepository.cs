using Domain.Common.Filters;
using Domain.Entities;

namespace Domain.Interfaces.Repositories
{
    public interface IAppointmentRepository
    {
        Task AddAppointment(Appointment appointment);
        Task<Appointment> GetAppointmentAsync(int id, CancellationToken cancellationToken = default);
        Task<(List<Appointment> Appointments, int TotalCount)> GetAppointmentsAsync(AppointmentFilter filters, CancellationToken cancellationToken = default);
        void DeleteAppointment(Appointment appointment, CancellationToken cancellationToken = default);
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        //Task<AppointmentImage> AddImageAsync(AppointmentImage image);
        //Task<List<AppointmentImage>> AddImagesAsync(IEnumerable<AppointmentImage> images);
        //Task<int> GetImagesCount(int appointmentId);

        Task<List<ServiceCategory>> GetBookingDataAsync(CancellationToken ct);
        Task<List<Addon>> GetAddonsAsync(CancellationToken ct);
        Task<List<Variant>> GetVariantsAsync(CancellationToken ct);
    }
}
