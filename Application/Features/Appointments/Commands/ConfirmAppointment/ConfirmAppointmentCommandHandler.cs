using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.ConfirmAppointment
{
    public class ConfirmAppointmentCommandHandler : IRequestHandler<ConfirmAppointmentCommand>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public ConfirmAppointmentCommandHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task Handle(ConfirmAppointmentCommand request, CancellationToken cancellationToken)
        {
            Appointment appointment = await _appointmentRepository.GetAppointment(request.AppointmentId, cancellationToken);

            if (appointment is null)
                throw new NotFoundException(typeof(Appointment).Name, request.AppointmentId);

            appointment.ConfirmWithModifications(request.From, request.To, request.NailService, request.NailSize, request.NailForm, request.NailAddons, request.AdditionalNotesArtist);

            await _appointmentRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
