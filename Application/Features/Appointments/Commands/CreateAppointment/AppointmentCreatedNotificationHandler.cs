using Domain.Entities;
using Domain.Events;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateAppointment
{
    public class AppointmentCreatedEventHandler : INotificationHandler<AppointmentCreatedEvent>
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserRepository _artitstRepository;

        public AppointmentCreatedEventHandler(INotificationRepository notificationRepository, IUserRepository artitstRepository)
        {
            _notificationRepository = notificationRepository;
            _artitstRepository = artitstRepository;
        }

        public async Task Handle(AppointmentCreatedEvent notification, CancellationToken cancellationToken)
        {
            Appointment appointment = notification.Appointment;

            if (appointment.ArtistId is null)
            {
                User? manager = await _artitstRepository.GetManager(cancellationToken);

                if (manager is null) return;

                Notification managerNotification = new Notification(manager.Id, "Nowa prośba o wizytę!", $"Użytkownik {appointment.Customer?.Name ?? "Brak nazwy"} złożył prośbę o wizytę ({appointment.Service.Name}) na {appointment.RequestedDates?.FirstOrDefault()?.From:dd.MM HH:mm}.", appointment.Id.ToString());
                await _notificationRepository.AddAsync(managerNotification, cancellationToken);
            }
            else
            {
                Notification artistNotification = new Notification(appointment.ArtistId.Value, "Wizyta potwierdzona!", $"Potwierdziłeś wizytę ({appointment.Service.Name}) dla klienta {appointment.Customer?.Name ?? "Brak nazwy"} na {appointment.From:dd.MM HH:mm}.", appointment.Id.ToString());
                await _notificationRepository.AddAsync(artistNotification, cancellationToken);
            }

            // Nalezy dodac jakis SignalR ping do obu użytkowników będzie obsługiwany przez NotificationService,
            // który nasłuchuje na dodanie nowych powiadomień i wysyła je do odpowiednich klientów.

            await _notificationRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
