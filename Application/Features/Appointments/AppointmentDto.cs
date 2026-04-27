using Application.Features.Appointments.Queries.GetAppointmentBookingData;
using Domain.Entities.Common;
using Domain.Enums;

namespace Application.Features.Appointments
{
    public record AppointmentDto
    {
        public required int Id { get; init; }
        public int? ArtistId { get; init; }
        public string ArtistName { get; init; }
        public List<DateTimeFromTo>? RequestedDates { get; init; }
        public required string Status { get; init; }
        public DateTime? From { get; init; } = null;
        public DateTime? To { get; init; } = null;
        public ServiceDto? Service { get; init; }
        public NailSize? NailSize { get; init; }
        public VariantDto? Variant { get; init; }
        public List<AddonDto>? Addons { get; init; }
        public string? AdditionalNotesUser { get; init; }
        public string? AdditionalNotesArtist { get; init; }
        public string? CustomerName { get; init; }
        public string? CustomerPhone { get; init; }
        public decimal TotalPrice { get; init; }
        public int TotalDurationInMinutes { get; init; }
    }
}
