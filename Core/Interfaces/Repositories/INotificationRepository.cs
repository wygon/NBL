using Domain.Entities;

namespace Domain.Interfaces.Repositories
{
    public interface INotificationRepository : IBaseRepository<Notification>
    {
        Task<List<Notification>> GetUserNotificationsAsync(int userId, CancellationToken cancellationToken);
    }
}
