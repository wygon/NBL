using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class GetAppointmentsQueryHandler : IRequestHandler<GetAppointmentsQuery, GetAppointmentsDto>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public GetAppointmentsQueryHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<GetAppointmentsDto> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
        {
            //TODO: dobranie odpowiedniej metody i filtracji
            return _appointmentRepository.GetAppointments(request, cancellationToken);
        }
    }
}
