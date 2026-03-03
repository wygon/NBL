using Core.Classes;

namespace Infrastructure.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public List<AvailabilitySlot> AvailableSlots { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
