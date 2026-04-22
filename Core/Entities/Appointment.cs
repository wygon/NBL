using Domain.Common;
using Domain.Entities.Common;
using Domain.Entities.Statuses;
using Domain.Enums;
using Domain.Events;

namespace Domain.Entities
{
    public sealed class Appointment : BaseAuditableEntity
    {
        public List<DateTimeFromTo>? RequestedDates { get; private set; }
        public AppointmentStatus Status { get; private set; }
        public DateTime? From { get; private set; } = null;
        public DateTime? To { get; private set; } = null;
        public NailSize? NailSize { get; private set; }
        public string? AdditionalNotesUser { get; private set; }
        public string? AdditionalNotesArtist { get; private set; }

        public int? ArtistId { get; private set; }
        public int CustomerId { get; private set; }
        public int ServiceId { get; private set; }
        public int VariantId { get; private set; }

        public User? Artist { get; private set; } = null!;
        public User Customer { get; private set; } = null!;
        public Service Service { get; private set; }

        public Variant Variant { get; private set; }
        private readonly List<Addon> _addons = new();
        public IReadOnlyCollection<Addon> Addons => _addons.AsReadOnly();

        private readonly List<AppointmentImage> _images = new();
        public IReadOnlyCollection<AppointmentImage> Images => _images.AsReadOnly();

        //Zmienic na pobieranie z bazy
        public int TotalDurationInMinutes
        {
            get
            {
                int time = 0;
                if (Service != null)
                {
                    time = Service.DefaultDurationInMinutes;
                }

                if (Addons is { Count: > 0 })
                {
                    time += Addons.Sum(addon => addon.AdditionalDurationMinutes);
                }

                return time;
            }
        }

        //Zmienic na pobieranie z bazy
        public decimal TotalPrice
        {
            get
            {
                decimal price = 0m;
                if (Service != null)
                {
                    price = Service.DefaultPrice;
                }

                if (Addons is { Count: > 0 })
                {
                    price += Addons.Sum(addon => addon.AdditionalPrice);
                }

                return price;
            }
        }


        private Appointment(int artistId, int userId, AppointmentStatus status, List<DateTimeFromTo> requestedDates,
            Service? nailService, NailSize? nailSize, Variant? variant, List<Addon> nailAddons, string additionalNotes, DateTime? from = null, DateTime? to = null)
        {
            ArtistId = artistId;
            CustomerId = userId;
            Status = status;
            RequestedDates = requestedDates;
            Service = nailService;
            NailSize = nailSize;
            Variant = variant;
            _addons.AddRange(nailAddons);
            AdditionalNotesUser = additionalNotes;
            From = from;
            To = to;
        }

        private Appointment() { }

        public static Appointment RequestAppointment(int? artistId, int userId, List<DateTimeFromTo> requestedDates,
            Service nailService, NailSize? nailSize, Variant variant, IEnumerable<Addon> nailAddons, string? additionalNotes)
        {
            Appointment request = new Appointment()
            {
                ArtistId = artistId,
                CustomerId = userId,
                RequestedDates = requestedDates,
                Service = nailService,
                NailSize = nailSize,
                Variant = variant,
                AdditionalNotesUser = additionalNotes,
                Status = new RequestedStatus()
            };
            request._addons.AddRange(nailAddons);

            request.AddDomainEvent(new AppointmentCreatedEvent(request));

            return request;
        }

        public static Appointment CreateConfirmed(int artistId, int userId, DateTimeFromTo dateFromTo,
            Service? nailService, NailSize? nailSize, Variant? variant, List<Addon> nailAddons, string additionalNotes)
        {
            Appointment appointment = new Appointment(artistId, userId, new ConfirmedStatus(), null!, nailService, nailSize,
                variant, nailAddons, additionalNotes, dateFromTo.From, dateFromTo.To);

            appointment.AddDomainEvent(new AppointmentConfirmedEvent(appointment));

            return appointment;
        }

        public void ConfirmWithModifications(
    DateTime confirmedFrom,
    DateTime confirmedTo,
    int? artistId,
    int? serviceId,
    NailSize? size,
    int? variantId,
    List<Addon>? newAddons,
    string? artistNote)
        //decimal? customPrice,
        //int? customDuration)
        {
            Status.Confirm(this);

            From = confirmedFrom;
            To = confirmedTo;

            ArtistId = artistId;
            if (serviceId.HasValue) ServiceId = serviceId.Value;
            if (variantId.HasValue) VariantId = variantId.Value;

            NailSize = size;
            AdditionalNotesArtist = artistNote;

            if (newAddons != null)
            {
                _addons.Clear();
                _addons.AddRange(newAddons);
            }

            AddDomainEvent(new AppointmentConfirmedEvent(this));
        }

        public void ChangeArtist(User? newArtist)
        {
            User? oldArtist = Artist;
            Artist = newArtist;
            ArtistId = newArtist?.Id;

            AddDomainEvent(new AppointmentArtistChangedEvent(this, oldArtist, newArtist));
        }

        public void Cancel()
        {
            Status.Cancel(this);

            AddDomainEvent(new AppointmentCancelledEvent(this));
        }

        public void Completed()
        {
            Status.Complete(this);

            AddDomainEvent(new AppointmentFinishedNotification(this));
        }

        public void AddImage(AppointmentImage image)
        {
            if (_images.Count >= Constants.AppointmentConstants.MaxImagesPerAppointment)
                throw new InvalidOperationException($"Cannot add more than {Constants.AppointmentConstants.MaxImagesPerAppointment} images to an appointment.");

            _images.Add(image);
        }

        public void TransitionTo(AppointmentStatus newStatus)
        {
            Status = newStatus;
        }
    }
}
