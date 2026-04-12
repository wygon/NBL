using FluentValidation;

namespace Application.Features.Appointments.Commands.CreateConfirmedAppointment
{
    public class CreateConfirmedAppointmentValidator : AbstractValidator<CreateConfirmedAppointmentCommand>
    {
        public CreateConfirmedAppointmentValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("Użytkownik jest wymagany");

            RuleFor(x => x.RequestedArtistId)
                .GreaterThan(0).WithMessage("Należy wybrać stylistkę.");

            RuleFor(x => x.DateFromTo)
                .NotEmpty().WithMessage("Musisz podać termin.");

            RuleFor(x => x.AdditionalNotes)
                .MaximumLength(500).WithMessage("Notatka jest za długa.");
        }
    }
}
