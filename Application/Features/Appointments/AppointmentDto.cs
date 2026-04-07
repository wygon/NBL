using Domain.Entities.Common;
using Domain.Enums;

namespace Application.Features.Appointments
{
    public record AppointmentDto
    {
        public required int Id { get; init; }
        public List<DateTimeFromTo>? RequestedDates { get; init; }
        public required string Status { get; init; }
        public DateTime? From { get; init; } = null;
        public DateTime? To { get; init; } = null;
        public NailService? NailService { get; init; }
        public NailSize? NailSize { get; init; }
        public NailForm? NailForm { get; init; }
        public List<NailAddons>? NailAddons { get; init; }
        public string? AdditionalNotesUser { get; init; }
        public string? AdditionalNotesArtist { get; init; }
    }
}
