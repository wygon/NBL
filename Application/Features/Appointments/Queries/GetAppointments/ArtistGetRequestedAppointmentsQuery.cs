using Domain.Entities.Statuses;
using MediatR;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class ArtistGetRequestedAppointmentsQuery : IRequest<GetAppointmentsDto>
    {
        public int? ArtistId { get; set; } = null;
        public AppointmentStatus? Status { get; init; } = null;
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int Page { get; init; } = 1;
        public int Count { get; init; } = 10;
    }
}
