using AutoMapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Users.Queries.GetAllUsers
{
    public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, GetAllUsersDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public GetAllUsersHandler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<GetAllUsersDto> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            List<User> users = await _userRepository.GetAllAsync(cancellationToken);
            return new GetAllUsersDto()
            {
                Users = _mapper.Map<List<UserDto>>(users)
            };
        }
    }
}
