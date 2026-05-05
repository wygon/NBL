using FluentValidation;

namespace Application.Features.Appointments.Commands.TakeAppointment
{
    public class TakeAppointmentValidator : AbstractValidator<TakeAppointmentCommand>
    {
        public TakeAppointmentValidator()
        {
            RuleFor(x => x.AppointmentId)
                .GreaterThan(0).WithMessage("Wizyta jest wymagana");
        }
    }
}
