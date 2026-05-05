using Application.Features.Users;

namespace Application.Features.Authorization
{
    public record AuthResponseDto
    {
        public required UserDto User { get; init; }
        public required string Token { get; init; }
    }
}
