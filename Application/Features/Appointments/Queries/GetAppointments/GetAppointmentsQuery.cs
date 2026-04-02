using MediatR;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class GetAppointmentsQuery : IRequest<GetAppointmentsDto>
    {
        public int UserId { get; set; }
    }
}
