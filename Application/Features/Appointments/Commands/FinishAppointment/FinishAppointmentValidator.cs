using FluentValidation;

namespace Application.Features.Appointments.Commands.FinishAppointment
{
    public class FinishAppointmentValidator : AbstractValidator<FinishAppointmentCommand>
    {
        public FinishAppointmentValidator()
        {
            RuleFor(x => x.AppointmentId)
                .GreaterThan(0).WithMessage("Wizyta jest wymagana");
        }
    }
}
