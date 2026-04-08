using FluentValidation;

namespace Application.Features.Appointments.Queries.GetAppointments
{
    public class ArtistGetRequestAppointmentsQueryValidator : AbstractValidator<GetAppointmentsQuery>
    {
        public ArtistGetRequestAppointmentsQueryValidator()
        {
            //RuleFor(x => x.UserId)
            //    .GreaterThan(0).WithMessage("Użytkownik jest wymagany");
        }
    }
}
