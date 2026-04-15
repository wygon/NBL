using Domain.Entities;
using Domain.Enums;

namespace Domain.DTOs.Appointment
{
    public sealed record AppointmentSubmitDto
    {
        public required int Id { get; set; }
        public required int UserId { get; set; }
        public required int ArtistId { get; set; }
        public required DateTime From { get; set; }
        public required DateTime To { get; set; }
        public Service? NailService { get; init; }
        public NailSize? NailSize { get; init; }
        public Variant? Variant { get; init; }
        public List<Addon> Addons { get; init; }
        public string AdditionalNotesArtist { get; init; }
    }
}
