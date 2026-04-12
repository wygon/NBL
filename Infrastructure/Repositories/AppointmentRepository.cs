using Domain.Common.Filters;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class AppointmentRepository(AppDbContext context) : IAppointmentRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AddAppointment(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
        }

        public void DeleteAppointment(Appointment appointment, CancellationToken cancellationToken = default)
        {
            _context.Appointments.Remove(appointment);
        }

        public async Task<Appointment?> GetAppointmentAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task<(List<Appointment> Appointments, int TotalCount)> GetAppointmentsAsync(AppointmentFilter filters, CancellationToken cancellationToken = default)
        {
            IQueryable<Appointment> query = _context.Appointments;

            if (filters.UserId.HasValue) query = query.Where(x => x.UserId == filters.UserId);

            if (filters.ArtistId.HasValue) query = query.Where(x => x.ArtistId == filters.ArtistId);

            if (filters.Status != null) query = query.Where(x => x.Status == filters.Status);

            if (filters.From.HasValue) query = query.Where(x => x.From >= filters.From);

            if (filters.To.HasValue) query = query.Where(x => x.To <= filters.To);

            int totalCount = await query.CountAsync(cancellationToken);

            List<Appointment> appointments = await query
                .OrderByDescending(x => x.From)
                .Skip((filters.Page - 1) * filters.Count)
                .Take(filters.Count)
                .ToListAsync(cancellationToken);

            return (appointments, totalCount);
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task AddImageAsync(AppointmentImage image)
        {
            await _context.AppointmentImages.AddAsync(image);
        }

        public async Task AddImagesAsync(IEnumerable<AppointmentImage> images)
        {
            await _context.AppointmentImages.AddRangeAsync(images);
        }

    }
}
