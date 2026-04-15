namespace Application.Features.Appointments.Queries.GetAppointmentBookingData
{
    public record VariantDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
    }
}
