using Application.Configuration;
using Domain.Interfaces.Services;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services
{
    public class FileLocalStorageSystem : IFileStorageService
    {
        private readonly StorageSettings _settings;
        public FileLocalStorageSystem(IOptions<StorageSettings> settings)
        {
            _settings = settings.Value;

            if (!string.IsNullOrWhiteSpace(_settings.BasePath) && !Directory.Exists(_settings.BasePath))
                Directory.CreateDirectory(_settings.BasePath);
        }

        /// <inheritdoc/>
        public Task<bool> DeleteFileAsync(string relativePath)
        {
            string fullFilePath = Path.Combine(_settings.BasePath, relativePath);

            if (File.Exists(fullFilePath))
            {
                File.Delete(fullFilePath);
                return Task.FromResult(true);
            }

            return Task.FromResult(false);
        }

        /// <inheritdoc/>
        public Task<Stream> DownloadFileAsync(string relativePath)
        {
            string fullFilePath = Path.Combine(_settings.BasePath, relativePath);

            if (!File.Exists(fullFilePath))
                throw new FileNotFoundException($"Nie znaleziono pliku: {relativePath}");

            Stream fileStream = new FileStream(fullFilePath, FileMode.Open, FileAccess.Read);
            return Task.FromResult(fileStream);
        }

        /// <inheritdoc/>
        public Task<bool> ExistsAsync(string relativePath)
        {
            string fullFilePath = Path.Combine(_settings.BasePath, relativePath);
            return Task.FromResult(File.Exists(fullFilePath));
        }

        /// <inheritdoc/>
        public string GetFileUrl(string relativePath)
        {
            string url = $"{_settings.BaseUrl.TrimEnd('/')}/{relativePath.TrimStart('/')}";
            return url;
        }

        /// <inheritdoc/>
        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string folderName)
        {
            string safeExtension = Path.GetExtension(fileName);
            string uniqueFileName = $"{Guid.NewGuid()}{safeExtension}";
            string targetFolder = Path.Combine(_settings.BasePath, folderName);
            if (!Directory.Exists(targetFolder))
                Directory.CreateDirectory(targetFolder);

            string fullFilePath = Path.Combine(targetFolder, uniqueFileName);

            using (FileStream? fileStreamOutput = new FileStream(fullFilePath, FileMode.Create, FileAccess.Write))
            {
                await fileStream.CopyToAsync(fileStreamOutput);
            }

            return Path.Combine(folderName, uniqueFileName).Replace("\\", "/");
        }
    }
}
