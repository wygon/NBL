using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateConfirmedAppointment
{
    public class CancelAppointmentCommandHandler : IRequestHandler<CancelAppointmentCommand>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public CancelAppointmentCommandHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task Handle(CancelAppointmentCommand request, CancellationToken cancellationToken)
        {
            Appointment appointment = await _appointmentRepository.GetAppointment(request.Id, cancellationToken);

            if (appointment is null)
                throw new NotFoundException(typeof(Appointment).Name, request.Id);

            appointment.Cancel();

            //_appointmentRepository.DeleteAppointment(appointment);

            await _appointmentRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
