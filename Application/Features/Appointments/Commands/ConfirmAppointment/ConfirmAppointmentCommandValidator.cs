using FluentValidation;

namespace Application.Features.Appointments.Commands.ConfirmAppointment
{
    public class ConfirmAppointmentCommandValidator : AbstractValidator<ConfirmAppointmentCommand>
    {
        public ConfirmAppointmentCommandValidator()
        {
            RuleFor(x => x.AppointmentId)
                .GreaterThan(0).WithMessage("Wizyta jest wymagana");
        }
    }
}
