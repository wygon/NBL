using Domain.Entities.Common;
using Domain.Enums;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateAppointment
{
    public record CreateAppointmentCommand : IRequest<CreateAppointmentDto>
    {
        public int? RequestedArtistId { get; init; }
        public required int UserId { get; init; }
        public required List<DateTimeFromTo> RequestedDates { get; init; }
        public NailService? NailService { get; init; }
        public NailSize? NailSize { get; init; }
        public NailForm? NailForm { get; init; }
        public List<NailAddons> NailAddons { get; init; }
        public string AdditionalNotes { get; init; }
    }
}
