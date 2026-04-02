using Domain.Common;

namespace Domain.Entities
{
    public sealed class User : BaseAuditableEntity
    {
        public string Name { get; private set; }
        public string InstagramName { get; private set; }
        public string PhotoUrl { get; private set; }
        public string Email { get; private set; }
        public string PhoneNumber { get; private set; }

        public ICollection<Appointment> Appointments { get; set; }
    }
}
