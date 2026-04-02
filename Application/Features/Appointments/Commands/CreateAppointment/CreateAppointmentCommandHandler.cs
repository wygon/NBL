using Domain.Entities;
using Domain.Entities.Common;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateAppointment
{
    public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, CreateAppointmentDto>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IArtistRepository _artistRepository;
        public CreateAppointmentCommandHandler(IAppointmentRepository appointmentRepository, IArtistRepository artistRepository)
        {
            _appointmentRepository = appointmentRepository;
            _artistRepository = artistRepository;
        }

        public async Task<CreateAppointmentDto> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
        {
            //TODO: do poprawy w metodzie pojedynczej
            foreach (DateTimeFromTo date in request.RequestedDates)
            {
                bool isAvailable = await _artistRepository.IsAvailableAsync(request.RequestedArtistId, date, cancellationToken);

                if (isAvailable == false)
                {
                    throw new Exception($"Artist is not available for the requested date: {date.From} to {date.To}");
                }
            }

            Appointment appointment = Appointment.RequestAppointment(
                request.RequestedArtistId,
                request.UserId,
                request.RequestedDates,
                request.NailService,
                request.NailSize,
                request.NailForm,
                request.NailAddons,
                request.AdditionalNotes
            );

            await _appointmentRepository.AddAppointment(appointment);

            await _appointmentRepository.SaveChangesAsync(cancellationToken);

            return new CreateAppointmentDto() { Id = appointment.Id };
        }
    }
}
