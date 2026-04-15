using AutoMapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Queries.GetAppointmentBookingData
{
    public class GetAppointmentBookingDataHandler : IRequestHandler<GetAppointmentBookingDataQuery, BookingDataDto>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;
        public GetAppointmentBookingDataHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<BookingDataDto> Handle(GetAppointmentBookingDataQuery request, CancellationToken cancellationToken)
        {
            List<ServiceCategory> categories = await _appointmentRepository.GetBookingDataAsync(cancellationToken);
            List<Addon> addons = await _appointmentRepository.GetAddonsAsync(cancellationToken);
            List<Variant> variants = await _appointmentRepository.GetVariantsAsync(cancellationToken);

            return new BookingDataDto
            {
                Categories = _mapper.Map<List<ServiceCategoryDto>>(categories),
                Addons = _mapper.Map<List<AddonDto>>(addons),
                Forms = _mapper.Map<List<VariantDto>>(variants)
            };
        }
    }
}
