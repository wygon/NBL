namespace Domain.Interfaces.Services
{
    public interface IFileStorageService
    {
        /// <summary>
        /// Saving file and returns its unique name or relative path.
        /// </summary>
        /// <param name="fileStream">File data stream</param>
        /// <param name="fileName">Proposed name (with extension)</param>
        /// <param name="folderName">Subfolder (fx. "appointments/71")</param>
        /// <returns>Unique name or file path</returns>
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string folderName);

        /// <summary>
        /// Downloads a file as a data stream.
        /// </summary>
        Task<Stream> DownloadFileAsync(string fileName);

        /// <summary>
        /// Removing file.
        /// </summary>
        Task<bool> DeleteFileAsync(string fileName);

        /// <summary>
        /// Checking if file exists.
        /// </summary>
        Task<bool> ExistsAsync(string fileName);

        /// <summary>
        /// Generating public url to file download (or temporary signed URL).
        /// </summary>
        string GetFileUrl(string fileName);
    }
}
