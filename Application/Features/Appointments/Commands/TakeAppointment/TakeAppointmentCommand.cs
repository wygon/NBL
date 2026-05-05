using MediatR;

namespace Application.Features.Appointments.Commands.TakeAppointment
{
    public record TakeAppointmentCommand : IRequest
    {
        public required int AppointmentId { get; init; }
    }
}
