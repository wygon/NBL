using FluentValidation;

namespace Application.Features.Appointments.Commands.CancelConfirmedAppointment
{
    public class ConfirmAppointmentValidator : AbstractValidator<CancelAppointmentCommand>
    {
        public ConfirmAppointmentValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Wizyta jest wymagana");
        }
    }
}
