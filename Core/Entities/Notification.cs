using Domain.Common;

namespace Domain.Entities
{
    public class Notification : BaseAuditableEntity
    {
        public string Title { get; private set; }
        public string Message { get; private set; }
        public bool IsRead { get; private set; }
        public DateTime? ReadAt { get; private set; }

        // Odbiorca
        public int UserId { get; private set; }
        public User User { get; private set; }

        //public NotificationType Type { get; private set; }
        public string? RedirectUrl { get; private set; }

        private Notification() { } // Dla EF Core

        //public Notification(int userId, string title, string message, NotificationType type, string? redirectUrl = null)
        public Notification(int userId, string title, string message, string? redirectUrl = null)
        {
            UserId = userId;
            Title = title;
            Message = message;
            //Type = type;
            RedirectUrl = redirectUrl;
            IsRead = false;
        }

        public void MarkAsRead()
        {
            IsRead = true;
            ReadAt = DateTime.UtcNow;
        }
    }
}
