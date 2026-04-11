using MediatR;

namespace Application.Features.Appointments.Commands.CancelConfirmedAppointment
{
    public record CancelAppointmentCommand : IRequest
    {
        public required int Id { get; set; }
    }
}
