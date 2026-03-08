using Application.Common.Interfaces;
using Core.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Visits.Queries
{
    public class GetUserVisits : IRequest<List<VisitDto>>
    {
        public int UserID { get; }
    }

    public class GetUserVisitsHandler(IAppDbContext context) : IRequestHandler<GetUserVisits, List<VisitDto>>
    {
        private readonly IAppDbContext _context = context;
        public async Task<List<VisitDto>> Handle(GetUserVisits request, CancellationToken cancellationToken)
        {
        }
    }
}
