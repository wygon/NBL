using Domain.Entities.Statuses;

namespace Application.Persistence.Factories
{
    public static class AppointmentStatusFactory
    {
        private static readonly Dictionary<string, Func<AppointmentStatus>> _statuses =
            new(StringComparer.OrdinalIgnoreCase)
        {
            { nameof(RequestedStatus), () => new RequestedStatus() },
            { nameof(ConfirmedStatus), () => new ConfirmedStatus() },
            { nameof(CancelledStatus), () => new CancelledStatus() },
            { nameof(CompletedStatus), () => new CompletedStatus() }
        };

        public static AppointmentStatus Create(string typeName)
        {
            if (string.IsNullOrWhiteSpace(typeName))
                return null;

            var fullTypeName = typeName.EndsWith("Status") ? typeName : typeName + "Status";

            if (_statuses.TryGetValue(fullTypeName, out var factory))
            {
                return factory();
            }

            throw new ArgumentException($"Couldnt find status: {typeName}");
        }
    }
}
