using FluentValidation;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class ArtistGetRequestAppointmentsQueryValidator : AbstractValidator<ArtistGetRequestedAppointmentsQuery>
    {
        public ArtistGetRequestAppointmentsQueryValidator()
        {
            //RuleFor(x => x.UserId)
            //    .GreaterThan(0).WithMessage("Użytkownik jest wymagany");
        }
    }
}
