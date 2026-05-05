using Application.Features.Appointments.Commands.EditAppointment;
using FluentValidation;

namespace Application.Features.Appointments.Commands.AddAppointmentPhoto
{
    public class EditAppointmentValidator : AbstractValidator<EditAppointmentCommand>
    {
        public EditAppointmentValidator()
        {
        }
    }
}
