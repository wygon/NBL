using FluentValidation;

namespace Application.Features.Appointments.Commands.AddAppointmentPhoto
{
    public class AddAppointmentPhotoValidator : AbstractValidator<AddAppointmentPhotoCommand>
    {
        public AddAppointmentPhotoValidator()
        {
            RuleFor(x => x.AppointmentId)
                .GreaterThan(0).WithMessage("Brak wybranego wydarzenia.");

            RuleFor(x => x.FileName)
                .Length(1, 255).WithMessage("Nazwa pliku jest wymagana i nie może być pusta.");
        }
    }
}
