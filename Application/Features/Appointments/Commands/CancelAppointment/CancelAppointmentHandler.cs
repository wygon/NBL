using Application.Common.Interfaces;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Features.Appointments.Commands.CancelConfirmedAppointment
{
    public class CancelAppointmentHandler : IRequestHandler<CancelAppointmentCommand>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IIdentityProvider _identity;
        private readonly ILogger _logger;
        public CancelAppointmentHandler(IIdentityProvider identity, IAppointmentRepository appointmentRepository, ILogger<CancelAppointmentHandler> logger)
        {
            _appointmentRepository = appointmentRepository;
            _identity = identity;
            _logger = logger;
        }

        public async Task Handle(CancelAppointmentCommand request, CancellationToken cancellationToken)
        {
            Appointment appointment = await _appointmentRepository.GetAppointmentAsync(request.Id, cancellationToken);

            _logger.LogInformation("User {UserId} is attempting to cancel appointment {AppointmentId}", _identity.UserId, request.Id);

            if (appointment is null)
                throw new NotFoundException(typeof(Appointment).Name, request.Id);

            if (!_identity.IsAdmin && !await _identity.AuthorizeAsync(Policies.CanManageAppointments) && appointment.CustomerId != _identity.UserId)
                throw new ForbiddenAccessException("Nie masz uprawnień do anulowania tej wizyty");

            appointment.Cancel();

            await _appointmentRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("User {UserId} has successfully cancelled appointment {AppointmentId}", _identity.UserId, request.Id);
        }
    }
}
