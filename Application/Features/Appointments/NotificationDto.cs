namespace Application.Features.Appointments
{
    public record NotificationDto(int Id,
        string Title,
        string Message,
        bool IsRead,
        DateTime CreatedAt,
        string? RedirectUrl);
}
