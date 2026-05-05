using Domain.Entities.Common;
using Domain.Enums;
using MediatR;

namespace Application.Features.Appointments.Commands.EditAppointment
{
    public record EditAppointmentCommand : IRequest<EditAppointmentDto>
    {
        public required int Id { get; init; }
        public required List<DateTimeFromTo>? RequestedDates { get; init; }
        public required string? Status { get; init; }
        public required DateTime? From { get; init; }
        public required DateTime? To { get; init; }
        public required NailSize? NailSize { get; init; }
        public required string? AdditionalNotesUser { get; init; }
        public required string? AdditionalNotesArtist { get; init; }
        public required int? ArtistId { get; init; }
        public required int? CustomerId { get; init; }
        public required int? ServiceId { get; init; }
        public required int? VariantId { get; init; }
    }
}
