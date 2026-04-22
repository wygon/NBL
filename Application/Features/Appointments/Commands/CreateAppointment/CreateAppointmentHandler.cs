using Domain.Entities;
using Domain.Entities.Common;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateAppointment
{
    public class CreateAppointmentHandler : IRequestHandler<CreateAppointmentCommand, CreateAppointmentDto>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserRepository _artistRepository;
        private readonly IServiceRepository _serviceRepository;
        private readonly IVariantRepository _variantRepository;
        private readonly IAddonRepository _addonRepository;
        public CreateAppointmentHandler(IAppointmentRepository appointmentRepository, IUserRepository artistRepository, IServiceRepository serviceRepository, IVariantRepository variantRepository, IAddonRepository addonRepository)
        {
            _appointmentRepository = appointmentRepository;
            _artistRepository = artistRepository;
            _serviceRepository = serviceRepository;
            _variantRepository = variantRepository;
            _addonRepository = addonRepository;
        }

        public async Task<CreateAppointmentDto> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
        {
            //TODO: do poprawy w metodzie pojedynczej
            foreach (DateTimeFromTo date in request.RequestedDates)
            {
                bool isAvailable = request.RequestedArtistId.HasValue
                    ? isAvailable = await _artistRepository.IsArtistAvailableAsync(request.RequestedArtistId.Value, date, cancellationToken)
                    : isAvailable = await _artistRepository.IsAnyAvailableAsync(date, cancellationToken);

                if (isAvailable == false)
                {
                    throw new Exception($"Artist is not available for the requested date: {date.From} to {date.To}");
                }
            }

            var service = await _serviceRepository.GetByIdAsync(request.ServiceId, cancellationToken)
                  ?? throw new Exception("Usługa nie istnieje");

            var variant = await _variantRepository.GetByIdAsync(request.VariantId, cancellationToken)
                ?? throw new Exception("Variant does not exist");

            var addons = await _addonRepository.GetByIdsAsync(request.AddonsIds, cancellationToken);

            Appointment appointment = Appointment.RequestAppointment(
                request.RequestedArtistId,
                request.UserId,
                request.RequestedDates,
                service,
                request.NailSize,
                variant,
                addons,
                request.AdditionalNotes
            );

            await _appointmentRepository.AddAppointment(appointment);

            await _appointmentRepository.SaveChangesAsync(cancellationToken);

            return new CreateAppointmentDto() { Id = appointment.Id };
        }
    }
}
