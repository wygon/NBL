//using Domain.Interfaces.Repositories;
//using MediatR;

//namespace Application.Features.Appointments.Queries
//{
//    internal class GetWaitingAppointmentHandler(IAppointmentRepository _appointmentRepository) : IRequestHandler<GetWaitingAppointmentRequest, List<AppointmentListDTOs>>
//    {
//        public async Task<List<AppointmentListDTOs>> Handle(GetWaitingAppointmentRequest request, CancellationToken cancellationToken)
//        {
//            return await _appointmentRepository.GetWaitingAppointments(request.UserId);
//        }
//    }
//}
