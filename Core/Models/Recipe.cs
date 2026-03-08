namespace Core.Models
{
    public class Recipe : BaseEntity
    {
        public int Id { get; set; }



        public bool IsDeleted { get; set; }

        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
    }
}
