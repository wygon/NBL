using Domain.Common;

namespace Domain.Entities
{
    public sealed class Service : BaseAddableEntity
    {
        public string Name { get; private set; }
        public string? Description { get; private set; }
        public decimal DefaultPrice { get; private set; }
        public int DefaultDurationInMinutes { get; private set; }
        public bool IsActive { get; private set; }
        public int CategoryId { get; private set; }
        public ServiceCategory Category { get; private set; } = null!;

        private Service() { }

        public Service(string name, string? description, decimal price, int duration, int categoryId)
        {
            Name = name;
            Description = description;
            DefaultPrice = price;
            DefaultDurationInMinutes = duration;
            CategoryId = categoryId;
            IsActive = true;
        }

        public void UpdateDetails(string name, decimal price, int duration)
        {
            Name = name;
            DefaultPrice = price;
            DefaultDurationInMinutes = duration;
        }

        public void Deactivate() => IsActive = false;
        public void Delete()
        {
            if (IsSystem)
            {
                throw new InvalidOperationException("Nie można usunąć systemowej usługi.");
            }
            else
            {
                IsDeleted = true;
                IsActive = false;
            }
        }
    }
}
