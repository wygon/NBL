using MediatR;

namespace Application.Features.Appointments.Commands.FinishAppointment
{
    public record FinishAppointmentCommand : IRequest
    {
        public required int AppointmentId { get; init; }
    }
}
