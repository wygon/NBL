namespace Domain.Exceptions
{
    public class RecordExistsException : Exception
    {
        public RecordExistsException() : base("Record already exists.") { }
        public RecordExistsException(string message) : base(message) { }
    }
}
