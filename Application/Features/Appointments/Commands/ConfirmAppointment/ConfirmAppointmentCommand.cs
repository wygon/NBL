using Domain.Entities;
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
        public Service? Service { get; init; }
        public NailSize? NailSize { get; init; }
        public Variant? Variant { get; init; }
        public List<Addon>? Addons { get; init; }
        public string? AdditionalNotesArtist { get; init; }
    }
}
