namespace Application.Features.Appointments.Queries.GetAppointmentBookingData
{
    public record AddonDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public decimal AdditionalPrice { get; init; }
        public int AdditionalDurationMinutes { get; init; }
    }
}
