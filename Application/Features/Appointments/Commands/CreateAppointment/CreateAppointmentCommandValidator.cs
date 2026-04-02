using FluentValidation;

namespace Application.Features.Appointments.Commands.CreateAppointment
{
    public class CreateAppointmentCommandValidator : AbstractValidator<CreateAppointmentCommand>
    {
        public CreateAppointmentCommandValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("Użytkownik jest wymagany");

            RuleFor(x => x.RequestedArtistId)
                .GreaterThan(0).WithMessage("Należy wybrać stylistkę.");

            RuleFor(x => x.RequestedDates)
                .NotEmpty().WithMessage("Musisz podać przynajmniej jeden termin.")
                .Must(x => x.All(d => d.From > DateTime.Now)).WithMessage("Wszystkie daty muszą być w przyszłości.");

            RuleFor(x => x.AdditionalNotes)
                .MaximumLength(500).WithMessage("Notatka jest za długa.");
        }
    }
}
