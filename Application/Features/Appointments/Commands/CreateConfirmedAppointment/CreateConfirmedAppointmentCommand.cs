using Domain.Entities;
using Domain.Entities.Common;
using Domain.Enums;
using MediatR;

namespace Application.Features.Appointments.Commands.CreateConfirmedAppointment
{
    public record CreateConfirmedAppointmentCommand : IRequest<CreateConfirmedAppointmentDto>
    {
        public required int RequestedArtistId { get; init; }
        public required int UserId { get; init; }
        public required DateTimeFromTo DateFromTo { get; init; }

        public Service? NailService { get; init; }
        public NailSize? NailSize { get; init; }
        public Variant? Variant { get; init; }
        public List<Addon>? Addons { get; init; }
        public string? AdditionalNotes { get; init; }
    }
}
