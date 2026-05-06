using Domain.Entities.Common;
using Domain.Enums;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateAppointment
{
    public class CreateAppointmentCommand : IRequest<CreateAppointmentDto>
    {
        public int? RequestedArtistId { get; init; }
        public required int UserId { get; set; }
        public required List<DateTimeFromTo> RequestedDates { get; init; }
        public int ServiceId { get; init; }
        public NailSize? NailSize { get; init; }
        public int VariantId { get; init; }
        public List<int> AddonsIds { get; init; } = new();
        public string? AdditionalNotes { get; init; }
    }
}
