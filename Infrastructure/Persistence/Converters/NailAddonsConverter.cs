using Domain.Enums;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Infrastructure.Persistence.Converters
{
    public class NailAddonsConverter : ValueConverter<List<NailAddons>, string>
    {
        private static JsonSerializerOptions jsonOptions = new JsonSerializerOptions
        {
            Converters = { new JsonStringEnumConverter() }
        };

        public NailAddonsConverter()
            : base(
            v => JsonSerializer.Serialize(v, jsonOptions),
            v => JsonSerializer.Deserialize<List<NailAddons>>(v, jsonOptions) ?? new List<NailAddons>())
        { }
    }
}
