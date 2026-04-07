using Domain.Entities.Common;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace Infrastructure.Persistence.Converters
{
    public class DateTimeFromToConverter : ValueConverter<List<DateTimeFromTo>, string>
    {
        public DateTimeFromToConverter()
            : base(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
            v => JsonSerializer.Deserialize<List<DateTimeFromTo>>(v, (JsonSerializerOptions)null))
        { }

    }
}
