//using Application.Common.Interfaces;
//using Domain.DTOs;
//using MediatR;

//namespace Application.Features.Visits.Queries
//{
//    public class GetUserVisits : IRequest<List<VisitDto>>
//    {
//        public int UserID { get; }
//    }

//    public class GetUserVisitsHandler : IRequestHandler<GetUserVisits, List<VisitDto>>
//    {
//        public async Task<List<VisitDto>> Handle(GetUserVisits request, CancellationToken cancellationToken)
//        {
//        }
//    }
//}
