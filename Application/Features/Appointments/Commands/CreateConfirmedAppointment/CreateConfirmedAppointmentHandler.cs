using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateConfirmedAppointment
{
    public class CreateConfirmedAppointmentHandler : IRequestHandler<CreateConfirmedAppointmentCommand, CreateConfirmedAppointmentDto>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserRepository _artistRepository;
        public CreateConfirmedAppointmentHandler(IAppointmentRepository appointmentRepository, IUserRepository artistRepository)
        {
            _appointmentRepository = appointmentRepository;
            _artistRepository = artistRepository;
        }

        public async Task<CreateConfirmedAppointmentDto> Handle(CreateConfirmedAppointmentCommand request, CancellationToken cancellationToken)
        {
            bool isAvailable = await _artistRepository.IsArtistAvailableAsync(request.RequestedArtistId, request.DateFromTo, cancellationToken);

            if (!isAvailable)
                throw new Exception($"Artist is not available for the requested date: {request.DateFromTo.From} to {request.DateFromTo.To}");

            Appointment appointment = Appointment.CreateConfirmed(
                request.RequestedArtistId,
                request.UserId,
                request.DateFromTo,
                request.NailService,
                request.NailSize,
                request.Variant,
                request.Addons,
                request.AdditionalNotes
            );

            await _appointmentRepository.AddAppointment(appointment);

            await _appointmentRepository.SaveChangesAsync(cancellationToken);

            return new CreateConfirmedAppointmentDto() { Id = appointment.Id };
        }
    }
}
