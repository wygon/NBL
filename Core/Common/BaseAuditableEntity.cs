namespace Domain.Common
{
    public abstract class BaseAuditableEntity : BaseEntity
    {
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; } = null;
        public DateTime? DeletedDate { get; set; } = null;
        public bool IsDeleted { get; set; } = false;
    }
}
