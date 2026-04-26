using MediatR;

namespace Application.Features.Notifications.Queries.GetNotifications
{
    public class GetNotificationsQuery : IRequest<GetNotificationsDto>
    {
        public int UserId { get; set; }
    }
}