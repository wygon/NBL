using Application.Persistence.Factories;
using Domain.Entities;
using Domain.Entities.Statuses;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.EditAppointment
{
    public class EditAppointmentHandler : IRequestHandler<EditAppointmentCommand, EditAppointmentDto>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public EditAppointmentHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<EditAppointmentDto> Handle(EditAppointmentCommand request, CancellationToken cancellationToken)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(request.Id, cancellationToken);

            if (appointment is null) throw new NotFoundException(typeof(Appointment).Name, request.Id);

            appointment.ForceEditDetails(
                status: SetAppointmentStatusIfSetted(request.Status),
                from: request.From,
                to: request.To,
                nailSize: request.NailSize,
                aunotes: request.AdditionalNotesUser,
                aanotes: request.AdditionalNotesArtist,
                artistId: request.ArtistId,
                customerId: request.CustomerId,
                serviceId: request.ServiceId,
                variantId: request.VariantId
            );

            await _appointmentRepository.SaveChangesAsync(cancellationToken);

            return new EditAppointmentDto();
        }

        private AppointmentStatus? SetAppointmentStatusIfSetted(string? newStatus)
        {
            return AppointmentStatusFactory.Create(newStatus!);
        }
    }
}
