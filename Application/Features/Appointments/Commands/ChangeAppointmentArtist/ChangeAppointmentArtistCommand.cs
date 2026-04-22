using MediatR;

namespace Application.Features.Appointments.Commands.ChangeAppointmentArtist
{
    public record ChangeAppointmentArtistCommand : IRequest
    {
        public required int AppointmentId { get; init; }
        public required int? NewArtistId { get; init; }
    }
}
