using Domain.Enums;

namespace Application.Features.Users
{
    public record ArtistDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string InstagramName { get; set; }
        public string PhotoUrl { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public UserRole Role { get; set; }
    }
}
