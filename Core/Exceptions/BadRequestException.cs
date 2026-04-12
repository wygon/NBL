namespace Domain.Exceptions
{
    /// <summary>
    /// Exception thrown when a request is invalid from a business point of view.
    /// Mapped to HTTP 400 Bad Request
    /// </summary>
    public class BadRequestException : Exception
    {
        public BadRequestException()
            : base("Wystąpił błąd podczas przetwarzania żądania.")
        {
        }

        public BadRequestException(string message)
            : base(message)
        {
        }

        public BadRequestException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
