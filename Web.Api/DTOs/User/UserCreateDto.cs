namespace Domain.DTOs.User
{
    public record UserCreateDto
    {
        public required string Name { get; init; }
        public required string InstagramName { get; init; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
