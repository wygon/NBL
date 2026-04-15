namespace Domain.Common
{
    public abstract class BaseAddableEntity : BaseAuditableEntity
    {
        public bool IsSystem { get; protected set; }
        public void MarkAsSystem() => IsSystem = true;
    }
}
