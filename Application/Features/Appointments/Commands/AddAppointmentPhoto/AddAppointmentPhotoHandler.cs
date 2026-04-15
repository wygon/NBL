using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using MediatR;

namespace Application.Features.Appointments.Commands.AddAppointmentPhoto
{
    public class AddAppointmentPhotoHandler : IRequestHandler<AddAppointmentPhotoCommand, List<AddAppointmentPhotoDto>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IFileStorageService _fileStorageService;
        public AddAppointmentPhotoHandler(IAppointmentRepository appointmentRepository, IFileStorageService fileStorageService)
        {
            _appointmentRepository = appointmentRepository;
            _fileStorageService = fileStorageService;
        }

        public async Task<List<AddAppointmentPhotoDto>> Handle(AddAppointmentPhotoCommand request, CancellationToken cancellationToken)
        {
            throw new Exception("To jest źle biznesowo, biznesowe rzeczy powinny sie dziac w domain a application ma tylko wywolac dane (np interface) i przekazac je do domain.");
            //Appointment appointment = await _appointmentRepository.GetAppointmentAsync(request.AppointmentId, cancellationToken);

            //if (appointment is null)
            //    throw new NotFoundException(nameof(Appointment), request.AppointmentId);

            //int imagesCount = await _appointmentRepository.GetImagesCount(appointment.Id);

            ////TODO: Max5 gdzies znalesc lepsze miejsce do zapisania tego, ale na razie zostawiam tu
            //int currentImagesCount = await _appointmentRepository.GetImagesCount(appointment.Id);
            //if (currentImagesCount + request.Files.Count > AppointmentConstants.MaxImagesPerAppointment)
            //    throw new BadRequestException($"Nie można dodać {request.Files.Count} zdjęć. Limit to {AppointmentConstants.MaxImagesPerAppointment}.");

            //string folder = StorageContainers.GetAppointmentFolder(appointment.Id);
            //List<(string StoredPath, string OriginalName, string? Label)> uploadedPaths = new();

            //try
            //{
            //    foreach (FileUploadModel file in request.Files)
            //    {
            //        string storedPath = await _fileStorageService.UploadFileAsync(file.Stream, file.FileName, folder);
            //        uploadedPaths.Add((storedPath, file.FileName, file.Label));
            //    }

            //    List<AppointmentImage> newImages = uploadedPaths.Select(x =>
            //        new AppointmentImage(x.StoredPath, x.OriginalName, appointment.Id, x.Label)
            //    ).ToList();

            //    List<AppointmentImage> savedImages = await _appointmentRepository.AddImagesAsync(newImages);

            //    await _appointmentRepository.SaveChangesAsync(cancellationToken);

            //    return savedImages.Select(img => new AddAppointmentPhotoDto
            //    {
            //        Id = img.Id,
            //        Url = _fileStorageService.GetFileUrl(img.StoredPath)
            //    }).ToList();
            //}
            //catch (Exception)
            //{
            //    foreach ((string StoredPath, string OriginalName, string? Label) path in uploadedPaths)
            //        await _fileStorageService.DeleteFileAsync(path.StoredPath);

            //    throw;
            //}
        }
    }
}
