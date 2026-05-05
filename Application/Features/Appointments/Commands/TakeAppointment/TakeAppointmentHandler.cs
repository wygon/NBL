using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.TakeAppointment
{
    public class TakeAppointmentHandler : IRequestHandler<TakeAppointmentCommand>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IIdentityProvider _identity;
        public TakeAppointmentHandler(IAppointmentRepository appointmentRepository, IUserRepository artistRepository, IIdentityProvider identityProvider)
        {
            _appointmentRepository = appointmentRepository;
            _userRepository = artistRepository;
            _identity = identityProvider;
        }

        public async Task Handle(TakeAppointmentCommand request, CancellationToken cancellationToken)
        {
            Appointment appointment = await _appointmentRepository.GetAppointmentAsync(request.AppointmentId, cancellationToken);

            if (appointment is null)
                throw new NotFoundException(typeof(Appointment).Name, request.AppointmentId);

            if (appointment.ArtistId.HasValue)
                throw new Exception("Wizyta ma już przypisanego artystę.");

            User? me = await _userRepository.GetByIdAsync(_identity.UserId, cancellationToken);

            appointment.ChangeArtist(me);

            await _appointmentRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
