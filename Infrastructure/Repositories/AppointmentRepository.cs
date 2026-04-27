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

        public async Task<List<Addon>> GetAddonsAsync(List<int> ids = null, CancellationToken ct = default)
        {
            IQueryable<Addon> query = _context.Addons;

            if (ids is { Count: > 0 }) query = query.Where(a => ids.Contains(a.Id));

            return await query.ToListAsync(ct);
        }

        public async Task<Appointment?> GetAppointmentAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Appointments
                .Include(x => x.Customer)
                .Include(x => x.Artist)
                .Include(x => x.Service)
                .Include(x => x.Variant)
                .Include(x => x.Addons)
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task<(List<Appointment> Appointments, int TotalCount)> GetAppointmentsAsync(AppointmentFilter filters, CancellationToken cancellationToken = default)
        {
            IQueryable<Appointment> query = _context.Appointments;

            if (filters.UserId.HasValue) query = query.Where(x => x.CustomerId == filters.UserId);

            if (filters.ArtistId.HasValue && filters.IncludeUnassigned)
                query = query.Where(x => x.ArtistId == filters.ArtistId || x.ArtistId == null);
            else if (filters.ArtistId.HasValue)
                query = query.Where(x => x.ArtistId == filters.ArtistId);
            else if (filters.IncludeUnassigned)
                query = query.Where(x => x.ArtistId == null);

            if (filters.Status != null)
                query = query.Where(x => x.Status.GetType() == filters.Status.GetType());

            if (filters.From.HasValue) query = query.Where(x => x.From >= filters.From);

            if (filters.To.HasValue) query = query.Where(x => x.To <= filters.To);

            int totalCount = await query.CountAsync(cancellationToken);

            List<Appointment> appointments = await query
                .Include(x => x.Customer)
                .Include(x => x.Artist)
                .Include(x => x.Service)
                .Include(x => x.Variant)
                .Include(x => x.Addons)
                .OrderByDescending(x => x.From)
                .Skip((filters.Page - 1) * filters.Count)
                .Take(filters.Count)
                .ToListAsync(cancellationToken);

            return (appointments, totalCount);
        }

        public async Task<List<ServiceCategory>> GetBookingDataAsync(CancellationToken ct)
        {
            return await _context.ServiceCategories
                .Include(c => c.Services)
                .AsNoTracking() // Zwiększa wydajność, bo dane są tylko do odczytu
                .ToListAsync(ct);
        }

        public async Task<List<Variant>> GetVariantsAsync(CancellationToken ct)
        {
            return await _context.Variants
                .AsNoTracking()
                .ToListAsync(ct);
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        //public async Task AddImageAsync(AppointmentImage image)
        //{
        //    await _context.AppointmentImages.AddAsync(image);
        //}

        //public async Task AddImagesAsync(IEnumerable<AppointmentImage> images)
        //{
        //    await _context.AppointmentImages.AddRangeAsync(images);
        //}

        //public Task<int> GetImagesCount(int appointmentId)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
