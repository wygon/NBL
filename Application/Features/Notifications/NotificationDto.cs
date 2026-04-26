namespace Application.Features.Notifications
{
    public record NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime Created { get; set; }
        public string? RedirectUrl { get; set; }
    }
}
