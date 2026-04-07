using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Common
{
    [NotMapped]
    public class DateTimeFromTo
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }
}