namespace Domain.Constants
{
    public static class Policies
    {
        public const string AdminOnly = nameof(AdminOnly);
        public const string CanManageAppointments = nameof(CanManageAppointments);
        public const string Artist = nameof(Artist);
        public const string User = nameof(User);
        public const string AtLeast18 = nameof(AtLeast18);
    }
}
