using FluentValidation;

namespace Application.Features.Appointments.Commands.CancelConfirmedAppointment
{
    public class ConfirmAppointmentCommandValidator : AbstractValidator<CancelAppointmentCommand>
    {
        public ConfirmAppointmentCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Wizyta jest wymagana");
        }
    }
}
