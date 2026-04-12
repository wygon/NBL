namespace Domain.Constants
{
    public static class StorageContainers
    {
        public const string Appointments = "appointments";
        public const string Profiles = "profiles";
        public const string Portfolio = "portfolio";

        public static string GetAppointmentFolder(int appointmentId) => $"{Appointments}/{appointmentId}";
    }
}
