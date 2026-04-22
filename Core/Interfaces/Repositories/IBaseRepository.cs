namespace Domain.Interfaces.Repositories
{
    public interface IBaseRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id, CancellationToken ct);
        Task<List<T>> GetAllAsync(CancellationToken ct);
        Task<List<T>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken ct);
        Task AddAsync(T entity, CancellationToken ct);
        void Update(T entity);
        void Delete(T entity);
        Task<int> SaveChangesAsync(CancellationToken ct = default);
    }
}
