using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Common
{
    [NotMapped]
    public class DateTimeFromTo
    {
        public DateTimeFromTo(DateTime from, DateTime to)
        {
            From = from;
            To = to;
        }

        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }
}