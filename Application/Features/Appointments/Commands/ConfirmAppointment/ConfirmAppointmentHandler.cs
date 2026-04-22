using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.ConfirmAppointment
{
    public class ConfirmAppointmentHandler : IRequestHandler<ConfirmAppointmentCommand>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public ConfirmAppointmentHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task Handle(ConfirmAppointmentCommand request, CancellationToken cancellationToken)
        {
            Appointment appointment = await _appointmentRepository.GetAppointmentAsync(request.AppointmentId, cancellationToken);

            if (appointment is null)
                throw new NotFoundException(typeof(Appointment).Name, request.AppointmentId);

            List<Addon>? newAddons = null;
            if (request.AddonIds != null && request.AddonIds.Any())
            {
                newAddons = await _appointmentRepository.GetAddonsAsync(request.AddonIds);
            }

            // Wywołujemy zaktualizowaną metodę na encji
            appointment.ConfirmWithModifications(
                request.From,
                request.To,
                request.ArtistId,
                request.ServiceId,
                request.NailSize,
                request.VariantId,
                newAddons,
                request.AdditionalNotesArtist
            //request.TotalPrice,
            //request.TotalDurationInMinutes
            );

            await _appointmentRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
