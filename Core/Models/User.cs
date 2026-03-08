namespace Core.Models
{
    public class User : BaseEntity
    {
        public string Name { get; set; }
        public string InstagramName { get; set; }
        public string PhotoUrl { get; set; }
        public bool IsDeleted { get; set; }

        public ICollection<Appointment> Appointments { get; set; }
    }
}
