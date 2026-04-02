using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Exceptions
{
    public class RecordNotFoundException : Exception
    {
        public RecordNotFoundException() : base("Record not found.") { }
        public RecordNotFoundException(string message) : base(message) { }
    }
}
