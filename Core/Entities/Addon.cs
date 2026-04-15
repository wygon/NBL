using Domain.Common;

namespace Domain.Entities
{
    public sealed class Addon : BaseAddableEntity
    {
        public string Name { get; private set; }
        public decimal AdditionalPrice { get; private set; }
        public int AdditionalDurationMinutes { get; private set; }

        private Addon() { }

        public Addon(string name, decimal price, int duration)
        {
            Name = name;
            AdditionalPrice = price;
            AdditionalDurationMinutes = duration;
        }
    }
}
