using Domain.Common;

namespace Domain.Entities
{
    public sealed class User : BaseAuditableEntity
    {
        public string Name { get; set; }
        public string InstagramName { get; set; }
        public string PhotoUrl { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public ICollection<Appointment>? Appointments { get; set; }
    }
}
