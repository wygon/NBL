namespace Application.Features.Users.Queries.GetAllUsers
{
    public record GetAllUsersDto
    {
        public List<UserDto> Users { get; init; }
    }
}
