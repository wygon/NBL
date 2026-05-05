using Application.Common.Interfaces;
using Application.Features.Users;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Authorization.Commands.Login
{
    public class LoginHandler : IRequestHandler<LoginCommand, AuthResponseDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public LoginHandler(IUserRepository userRepository, IMapper mapper, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByNameAsync(request.Username, cancellationToken);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Nieprawidłowa nazwa użytkownika lub hasło.");
            }

            var token = _tokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                User = _mapper.Map<UserDto>(user),
                Token = token
            };
        }
    }
}
