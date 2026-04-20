using Application.Persistence.Factories;
using AutoMapper;
using Domain.Common.Filters;
using Domain.Entities;
using Domain.Entities.Statuses;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class GetAppointmentsHandler : IRequestHandler<GetAppointmentsQuery, GetAppointmentsDto>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;
        public GetAppointmentsHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<GetAppointmentsDto> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
        {
            AppointmentStatus? status = null;

            if (!string.IsNullOrEmpty(request.Status))
            {
                status = AppointmentStatusFactory.Create(request.Status);
            }

            AppointmentFilter appointmentFilter = new AppointmentFilter()
            {
                UserId = request.RequestedByUserId,
                ArtistId = request.ArtistId,
                IncludeUnassigned = request.NullArtist,
                Status = status,
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
