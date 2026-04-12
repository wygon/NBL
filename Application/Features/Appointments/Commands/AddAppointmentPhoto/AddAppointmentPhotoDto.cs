namespace Application.Features.Appointments.Commands.AddAppointmentPhoto
{
    public record AddAppointmentPhotoDto
    {
        public required int Id { get; init; }
        public required string Url { get; init; }
    }
}
