using Core.Models.Statuses;

namespace Infrastructure.Persistence.Factories
{
    public static class AppointmentStatusFactory
    {
        private static readonly Dictionary<string, Func<AppointmentStatus>> _statuses = 
            new (StringComparer.OrdinalIgnoreCase)
        {
            { nameof(PendingStatus), () => new PendingStatus() },
            { nameof(ConfirmedStatus), () => new ConfirmedStatus() },
            { nameof(CancelledStatus), () => new CancelledStatus() },
            { nameof(CompletedStatus), () => new CompletedStatus() }
        };

        public static AppointmentStatus Create(string typeName)
        {
            if (string.IsNullOrWhiteSpace(typeName))
            { }

            if(_statuses.TryGetValue(typeName, out var factory))
            {
                return factory();
            }

            throw new ArgumentException($"Couldnt find status: {typeName}");
        }
    }
}
