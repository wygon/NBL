using Core.Enums;
using Core.Models.Common;
using Core.Models.Statuses;

namespace Core.Models
{
    public class Appointment : BaseEntity
    {
        public List<DateTimeFromTo> RequestedDates { get; set; }
        public AppointmentStatus Status { get; private set; }
        public DateTime? From { get; set; } = null;
        public DateTime? To { get; set; } = null;
        public NailService? NailService { get; set; }
        public NailSize? NailSize { get; set; }
        public NailForm? NailForm { get; set; }
        public List<NailAddons> NailAddons { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
        public User User { get; set; }
        public Recipe Recipe { get; set; }

        public void TransitionTo(AppointmentStatus newStatus)
        {
            Status = newStatus;
        }
    }
}
