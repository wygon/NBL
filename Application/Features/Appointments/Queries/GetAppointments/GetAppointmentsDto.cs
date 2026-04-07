namespace Application.Features.Appointments.Queries.GetAppointments
{
    public record GetAppointmentsDto
    {
        public List<AppointmentDto> Appointments { get; init; }
        public int TotalCount { get; init; }
        public int Page { get; init; }
        public int Count { get; init; }
    }
}
