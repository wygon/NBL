using Application.Features.Appointments.Commands.ChangeAppointmentArtist;
using FluentValidation;

namespace Application.Features.Appointments.Commands.ConfirmAppointment
{
    public class ChangeAppointmentArtistValidator : AbstractValidator<ChangeAppointmentArtistCommand>
    {
        public ChangeAppointmentArtistValidator()
        {
            RuleFor(x => x.AppointmentId)
                .GreaterThan(0).WithMessage("Wizyta jest wymagana");
        }
    }
}
