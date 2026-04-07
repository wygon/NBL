using MediatR;

namespace Application.Features.Appointments.Commands.CreateConfirmedAppointment
{
    public record CancelAppointmentCommand : IRequest
    {
        public required int Id { get; set; }
    }
}
