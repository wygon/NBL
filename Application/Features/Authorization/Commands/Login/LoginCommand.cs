using Application.Features.Users;
using MediatR;

namespace Application.Features.Authorization.Commands.Login
{
    public record LoginCommand(string Username) : IRequest<UserDto> { }
}
