using Application.Features.Users;

namespace Application.Features.Artists.Queries.GetAllArtitsts
{
    public record GetAllArtistsDto
    {
        public List<UserDto> Artists { get; init; }
    }
}
