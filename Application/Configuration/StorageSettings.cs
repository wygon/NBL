namespace Application.Configuration
{
    public class StorageSettings
    {
        public string Provider { get; set; }
        public string BasePath { get; set; }
        public string BaseUrl { get; set; }
        public int MaxFileSizeMb { get; set; }
        public string[] AllowedExtensions { get; set; }
    }
}
