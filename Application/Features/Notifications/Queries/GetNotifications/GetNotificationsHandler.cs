using AutoMapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Notifications.Queries.GetNotifications
{
    public class GetNotificationsHandler : IRequestHandler<GetNotificationsQuery, GetNotificationsDto>
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;
        public GetNotificationsHandler(INotificationRepository notificationRepository, IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
        }

        public async Task<GetNotificationsDto> Handle(GetNotificationsQuery request, CancellationToken cancellationToken)
        {
            List<Notification> notifications = await _notificationRepository.GetUserNotificationsAsync(request.UserId, cancellationToken);
            return new GetNotificationsDto()
            {
                Notifications = _mapper.Map<List<NotificationDto>>(notifications)
            };
        }
    }
}
