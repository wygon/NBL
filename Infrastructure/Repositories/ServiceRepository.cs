using Domain.Entities;
using Domain.Interfaces.Repositories;
using InfrastrucancellationTokenure.Repositories;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    public class ServiceRepository : BaseRepository<Service>, IServiceRepository
    {
        public ServiceRepository(AppDbContext context) : base(context) { }
    }
}
