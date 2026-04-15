namespace Application.Features.Appointments.Queries.GetAppointmentBookingData
{
    public record BookingDataDto
    {
        public List<ServiceCategoryDto> Categories { get; init; } = new();
        public List<AddonDto> Addons { get; init; } = new();
        public List<VariantDto> Forms { get; init; } = new();
    }
}
