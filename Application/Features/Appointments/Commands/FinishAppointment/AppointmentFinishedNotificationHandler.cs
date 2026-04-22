using Domain.Entities;
using Domain.Events;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateAppointment
{
    public class AppointmentFinishedNotificationHandler : INotificationHandler<AppointmentFinishedNotification>
    {
        private readonly INotificationRepository _notificationRepository;

        public AppointmentFinishedNotificationHandler(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task Handle(AppointmentFinishedNotification notification, CancellationToken cancellationToken)
        {
            Appointment appointment = notification.Appointment;

            Notification customerNotification = new Notification(appointment.CustomerId, "Wizyta zakończona!", $"Twoja wizyta na {appointment.From:dd.MM.yyyy HH:mm} została zakończona. Dziękujemy za skorzystanie z naszych usług!");

            await _notificationRepository.AddAsync(customerNotification, cancellationToken);

            await _notificationRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
