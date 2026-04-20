using Domain.Entities.Statuses;

namespace Domain.Common.Filters
{
    public class AppointmentFilter : FromToFilter
    {
        public int? UserId { get; init; } = null;
        public int? ArtistId { get; init; } = null;
        public bool IncludeUnassigned { get; init; } = false;
        public AppointmentStatus? Status { get; init; } = null;
        public int Page { get; set; } = 1;
        public int Count { get; set; } = 10;
    }
}
