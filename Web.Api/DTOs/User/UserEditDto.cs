namespace Domain.DTOs.User
{
    public class UserEditDto
    {
        public required int Id { get; init; }
        public required string Name { get; init; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
