using FluentValidation;

namespace Application.Features.Appointments.Commands.CreateConfirmedAppointment
{
    public class CancelAppointmentCommandValidator : AbstractValidator<CancelAppointmentCommand>
    {
        public CancelAppointmentCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Wizyta jest wymagana");
        }
    }
}
