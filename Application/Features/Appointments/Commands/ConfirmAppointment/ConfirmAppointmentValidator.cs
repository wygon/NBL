using FluentValidation;

namespace Application.Features.Appointments.Commands.ConfirmAppointment
{
    public class ConfirmAppointmentValidator : AbstractValidator<ConfirmAppointmentCommand>
    {
        public ConfirmAppointmentValidator()
        {
            RuleFor(x => x.AppointmentId)
                .GreaterThan(0).WithMessage("Wizyta jest wymagana");
        }
    }
}
