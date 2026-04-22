using Domain.Entities;
using Domain.Events;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.ConfirmAppointment
{
    public class AppointmentConfirmedNotificationHandler : INotificationHandler<AppointmentConfirmedEvent>
    {
        private readonly INotificationRepository _notificationRepository;

        public AppointmentConfirmedNotificationHandler(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task Handle(AppointmentConfirmedEvent notification, CancellationToken cancellationToken)
        {
            Appointment appointment = notification.Appointment;

            Notification customerNotification = new Notification(appointment.CustomerId, "Wizyta potwierdzona!", $"Twoja wizyta ({appointment.Service.Name}) została zatwierdzona na {appointment.From:dd.MM HH:mm}.", appointment.Id.ToString());

            await _notificationRepository.AddAsync(customerNotification, cancellationToken);

            Notification artistNotification = new Notification(appointment.ArtistId!.Value, "Wizyta potwierdzona!", $"Potwierdziłeś wizytę ({appointment.Service.Name}) dla klienta {appointment.Customer.Name} na {appointment.From:dd.MM HH:mm}.", appointment.Id.ToString());

            await _notificationRepository.AddAsync(customerNotification, cancellationToken);

            // Nalezy dodac jakis SignalR ping do obu użytkowników będzie obsługiwany przez NotificationService,
            // który nasłuchuje na dodanie nowych powiadomień i wysyła je do odpowiednich klientów.


            await _notificationRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
