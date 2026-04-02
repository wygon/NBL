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
        public NailService? NailService { get; init; }
        public NailSize? NailSize { get; init; }
        public NailForm? NailForm { get; init; }
        public List<NailAddons> NailAddons { get; init; }
        public string AdditionalNotesArtist { get; init; }
    }
}
