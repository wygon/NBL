using Microsoft.EntityFrameworkCore.Infrastructure;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string InstagramName { get; set; }
        public string PhotoUrl { get; set; }
        public bool IsDeleted { get; set; }

        public ICollection<Appointment> Appointments { get; set; }
    }
}
