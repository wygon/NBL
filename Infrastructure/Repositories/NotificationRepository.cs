using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    public class NotificationRepository : BaseRepository<Notification>, INotificationRepository
    {
        public NotificationRepository(AppDbContext context) : base(context) { }
    }
}
