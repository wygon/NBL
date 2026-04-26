using Application.Features.Users;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Artists.Queries.GetAllArtitsts
{
    public class GetAllArtistsHandler : IRequestHandler<GetAllArtistsQuery, GetAllArtistsDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public GetAllArtistsHandler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<GetAllArtistsDto> Handle(GetAllArtistsQuery request, CancellationToken cancellationToken)
        {
            List<User> artists = await _userRepository.GetAllArtistsAsync(cancellationToken);
            return new GetAllArtistsDto()
            {
                Artists = _mapper.Map<List<ArtistDto>>(artists)
            };
        }
    }
}
