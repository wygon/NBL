using FluentValidation;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class GetAppointmentsQueryValidator : AbstractValidator<GetAppointmentsQuery>
    {
        public GetAppointmentsQueryValidator()
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
