using MediatR;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class GetAppointmentsQuery : IRequest<GetAppointmentsDto>
    {
        public int? RequestedByUserId { get; set; } = null;
        public int? ArtistId { get; set; } = null;
        public bool NullArtist { get; init; } = false;
        public string? Status { get; init; } = null;
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int Page { get; init; } = 1;
        public int Count { get; init; } = 10;
    }
}
