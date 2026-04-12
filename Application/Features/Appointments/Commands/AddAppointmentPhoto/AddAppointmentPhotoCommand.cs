using MediatR;

namespace Application.Features.Appointments.Commands.AddAppointmentPhoto
{
    public record FileUploadModel(Stream Stream, string FileName, string? Label);
    public record AddAppointmentPhotoCommand : IRequest<List<AddAppointmentPhotoDto>>
    {
        public required int AppointmentId { get; init; }
        public List<FileUploadModel> Files { get; init; } = new();
    }
}
