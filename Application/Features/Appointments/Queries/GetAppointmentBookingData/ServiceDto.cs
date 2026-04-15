namespace Application.Features.Appointments.Queries.GetAppointmentBookingData
{
    public record ServiceDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public decimal DefaultPrice { get; init; }
        public int DefaultDurationInMinutes { get; init; }
    }
}
