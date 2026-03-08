using Application.Common.Interfaces;
using Core.DTOs.Appointment;
using Core.Models.Statuses;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Appointments.Queries
{
    public class GetWaitingAppointment : IRequest<List<AppointmentListDTOs>>
    {
        public int UserId { get; set; }
    }

    internal class GetWaitingAppointmentProposalsHandler(IAppDbContext context) : IRequestHandler<GetWaitingAppointment, List<AppointmentListDTOs>>
    {
        private readonly IAppDbContext _context = context;
        public async Task<List<AppointmentListDTOs>> Handle(GetWaitingAppointment request, CancellationToken cancellationToken)
        {
            return await _context.Appointments
                .Where(a => a.UserId == request.UserId && a.Status is PendingStatus)
                .Select(a => new AppointmentListDTOs()
                {
                    Id = a.Id,
                    RequestedDates = a.RequestedDates,
                    Status = a.Status
                })
                .ToListAsync();
        }
    }
}
