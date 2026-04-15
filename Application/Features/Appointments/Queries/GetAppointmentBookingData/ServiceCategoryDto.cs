namespace Application.Features.Appointments.Queries.GetAppointmentBookingData
{
    public record ServiceCategoryDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }
        public List<ServiceDto> Services { get; init; } = new();
    }
}
