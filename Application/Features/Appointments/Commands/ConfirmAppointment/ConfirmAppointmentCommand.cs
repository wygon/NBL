using Domain.Enums;
using MediatR;

namespace Application.Features.Appointments.Commands.ConfirmAppointment
{
    public record ConfirmAppointmentCommand : IRequest
    {
        public required int AppointmentId { get; init; }
        public required DateTime From { get; init; }
        public required DateTime To { get; init; }
        public int? ArtistId { get; init; }
        public NailService? NailService { get; init; }
        public NailSize? NailSize { get; init; }
        public NailForm? NailForm { get; init; }
        public List<NailAddons>? NailAddons { get; init; }
        public string? AdditionalNotesArtist { get; init; }
    }
}
