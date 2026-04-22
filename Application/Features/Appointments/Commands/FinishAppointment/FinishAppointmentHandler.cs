using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.FinishAppointment
{
    public class FinishAppointmentHandler : IRequestHandler<FinishAppointmentCommand>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public FinishAppointmentHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task Handle(FinishAppointmentCommand request, CancellationToken cancellationToken)
        {
            Appointment appointment = await _appointmentRepository.GetAppointmentAsync(request.AppointmentId, cancellationToken);

            if (appointment is null)
                throw new NotFoundException(typeof(Appointment).Name, request.AppointmentId);

            appointment.Completed();

            await _appointmentRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
