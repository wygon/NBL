using MediatR;

namespace Application.Features.Authorization.Commands.Login
{
    public record LoginCommand(string Username) : IRequest<AuthResponseDto> { }
}
