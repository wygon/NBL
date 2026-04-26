namespace Application.Features.Notifications.Queries.GetNotifications
{
    public record GetNotificationsDto
    {
        public List<NotificationDto> Notifications { get; init; }
    }
}
