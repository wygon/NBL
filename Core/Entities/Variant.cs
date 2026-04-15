using Domain.Common;

namespace Domain.Entities
{
    public sealed class Variant : BaseAddableEntity
    {
        public string Name { get; private set; }

        private Variant() { }
        public Variant(string name)
        {
            Name = name;
        }
    }
}
