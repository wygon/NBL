using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    public class AppointmentRepository(AppDbContext context) : IAppointmentRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AddAppointment(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
        }

        public Task<List<Appointment>> GetWaitingAppointments(int userId)
        {
            throw new NotImplementedException();
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        //public async Task<List<AppointmentListDTOs>> GetWaitingAppointments(int userId)
        //    => await _context.Appointments
        //        .Where(a => a.UserId == userId && a.Status is PendingStatus)
        //        .Select(a => new AppointmentListDTOs()
        //        {
        //            Id = a.Id,
        //            RequestedDates = a.RequestedDates,
        //            Status = a.Status
        //        })
        //        .ToListAsync();
    }
}
