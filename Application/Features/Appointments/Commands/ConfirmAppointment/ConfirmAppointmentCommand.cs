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
        public int? ServiceId { get; init; }
        public int? VariantId { get; init; }
        public List<int>? AddonIds { get; init; }
        public NailSize? NailSize { get; init; }
        public string? AdditionalNotesArtist { get; init; }
        //public decimal? TotalPrice { get; init; }
        //public int? TotalDurationInMinutes { get; init; }
    }
}
