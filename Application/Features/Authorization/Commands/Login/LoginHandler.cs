using Application.Features.Users;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Authorization.Commands.Login
{
    public class LoginHandler : IRequestHandler<LoginCommand, UserDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public LoginHandler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<UserDto> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByNameAsync(request.Username, cancellationToken);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            return _mapper.Map<UserDto>(user);
        }
    }
}
