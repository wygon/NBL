using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Features.Appointments.Commands.ChangeAppointmentArtist
{
    public class ChangeAppointmentArtistHandler : IRequestHandler<ChangeAppointmentArtistCommand>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserRepository _userRepository;
        public ChangeAppointmentArtistHandler(IAppointmentRepository appointmentRepository, IUserRepository artistRepository)
        {
            _appointmentRepository = appointmentRepository;
            _userRepository = artistRepository;
        }

        public async Task Handle(ChangeAppointmentArtistCommand request, CancellationToken cancellationToken)
        {
            Appointment appointment = await _appointmentRepository.GetAppointmentAsync(request.AppointmentId, cancellationToken);

            if (appointment is null)
                throw new NotFoundException(typeof(Appointment).Name, request.AppointmentId);

            User? artist = request.NewArtistId.HasValue
                ? await _userRepository.GetByIdAsync(request.NewArtistId.Value, cancellationToken)
                : null;

            appointment.ChangeArtist(artist);

            await _appointmentRepository.SaveChangesAsync(cancellationToken);
        }
    }
}
