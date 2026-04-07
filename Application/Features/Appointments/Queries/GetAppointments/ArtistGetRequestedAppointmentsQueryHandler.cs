using AutoMapper;
using Domain.Common.Filters;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class ArtistGetRequestedAppointmentsQueryHandler : IRequestHandler<ArtistGetRequestedAppointmentsQuery, GetAppointmentsDto>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;
        public ArtistGetRequestedAppointmentsQueryHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<GetAppointmentsDto> Handle(ArtistGetRequestedAppointmentsQuery request, CancellationToken cancellationToken)
        {
            AppointmentFilter appointmentFilter = new AppointmentFilter()
            {
                ArtistId = request.ArtistId,
                Status = request.Status,
                From = request.From,
                To = request.To,
                Page = request.Page,
                Count = request.Count
            };

            (List<Appointment> appointments, int totalCount) = await _appointmentRepository.GetAppointmentsAsync(appointmentFilter, cancellationToken);

            return new GetAppointmentsDto()
            {
                Appointments = _mapper.Map<List<AppointmentDto>>(appointments),
                TotalCount = totalCount,
                Page = request.Page,
                Count = request.Count,
            };
        }
    }
}
