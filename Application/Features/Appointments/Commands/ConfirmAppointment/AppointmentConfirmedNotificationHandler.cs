using Domain.Entities;
using Domain.Entities.Statuses;
using Domain.Events;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.ConfirmAppointment
{
    public class AppointmentConfirmedNotificationHandler : INotificationHandler<AppointmentConfirmedEvent>
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserRepository _userRepository;

        public AppointmentConfirmedNotificationHandler(INotificationRepository notificationRepository, IUserRepository userRepository)
        {
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
        }

        public async Task Handle(AppointmentConfirmedEvent notification, CancellationToken cancellationToken)
        {
            Appointment appointment = notification.Appointment;
            if (appointment.Status is ConfirmedStatus confirmed)
            {
                Notification customerNotification = new Notification(appointment.CustomerId, "Wizyta potwierdzona!", $"Twoja wizyta ({appointment.Service.Name}) została zatwierdzona na {appointment.From:dd.MM HH:mm}.", appointment.Id.ToString());

                await _notificationRepository.AddAsync(customerNotification, cancellationToken);

                if (appointment.ArtistId.HasValue)
                {
                    Notification artistNotification = new Notification(appointment.ArtistId!.Value, "Wizyta potwierdzona!", $"Potwierdziłeś wizytę ({appointment.Service.Name}) dla klienta {appointment.Customer.Name} na {appointment.From:dd.MM HH:mm}.", appointment.Id.ToString());

                    await _notificationRepository.AddAsync(customerNotification, cancellationToken);
                }
                else
                {
                    User? manager = await _userRepository.GetManager();
                    if (manager is not null)
                    {
                        Notification managerNotification = new Notification(manager.Id, "Nowa wizyta!", $"Wizyta ({appointment.Service.Name}) dla klienta {appointment.Customer.Name} na {appointment.From:dd.MM HH:mm} czeka na artyste i potwierdzenie.", appointment.Id.ToString());

                        await _notificationRepository.AddAsync(managerNotification, cancellationToken);
                    }
                }

                await _notificationRepository.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
