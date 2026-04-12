using Domain.Common;

namespace Domain.Entities
{
    public class AppointmentImage : BaseAuditableEntity
    {
        public int AppointmentId { get; private set; }
        public string StoredPath { get; private set; }
        public string OriginalFileName { get; private set; }

        // Opcjonalnie: Typ zdjęcia (np. "Before", "After")
        public string? Label { get; private set; }

        private AppointmentImage() { } // Dla EF Core

        public AppointmentImage(string storedPath, string originalFileName, int appointmentId, string? label = null)
        {
            StoredPath = storedPath;
            OriginalFileName = originalFileName;
            AppointmentId = appointmentId;
            Label = label;
        }
    }
}
