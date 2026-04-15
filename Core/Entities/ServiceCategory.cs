using Domain.Common;

namespace Domain.Entities
{
    public sealed class ServiceCategory : BaseAddableEntity
    {
        public string Name { get; private set; }
        public string? Description { get; private set; }

        private readonly List<Service> _services = new();
        public IReadOnlyCollection<Service> Services => _services.AsReadOnly();

        private ServiceCategory() { }

        public ServiceCategory(string name, string? description, bool isSystem = false)
        {
            Name = name;
            Description = description;
            IsSystem = isSystem;
        }

        public void Update(string name, string? description)
        {
            Name = name;
            Description = description;
        }
    }
}
