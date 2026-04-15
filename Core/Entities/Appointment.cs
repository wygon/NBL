using Domain.Common;
using Domain.Entities.Common;
using Domain.Entities.Statuses;
using Domain.Enums;
using Domain.Events;

#nullable enable

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

        public int? ArtistId { get; init; }
        public int CustomerId { get; init; }
        public int ServiceId { get; init; }
        public int VariantId { get; init; }

        public User? Artist { get; init; } = null!;
        public User Customer { get; init; } = null!;
        public Service Service { get; private set; }

        /// <summary>
        /// Zastanowic sie jak to ugólnić, bo w sumie to może być różne dla różnych usług, a nie tylko dla paznokci. Może po prostu "Variant" albo "Option" albo coś w tym stylu?
        /// </summary>
        public Variant Variant { get; private set; }
        private readonly List<Addon> _addons = new();
        public IReadOnlyCollection<Addon> Addons => _addons.AsReadOnly();

        private readonly List<AppointmentImage> _images = new();
        public IReadOnlyCollection<AppointmentImage> Images => _images.AsReadOnly();

        public int TotalDurationMinutes => Service.DefaultDurationInMinutes + Addons.Sum(addon => addon.AdditionalDurationMinutes);
        public decimal TotalPrice => Service.DefaultPrice + _addons.Sum(addon => addon.AdditionalPrice);


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

        public void ConfirmWithModifications(DateTime confirmedFrom,
            DateTime confirmedTo,
            Service? service,
            NailSize? size,
            Variant? form,
            List<Addon>? nailAddons,
            string? artistNote)
        {
            Status.Confirm(this);

            From = confirmedFrom;
            To = confirmedTo;
            Service = service;
            NailSize = size;
            Variant = form;

            AdditionalNotesArtist = artistNote;

            if (nailAddons != null) _addons.AddRange(nailAddons);

            AddDomainEvent(new AppointmentConfirmedEvent(this));
        }

        public void Cancel()
        {
            Status.Cancel(this);

            //AddDomainEvent(new AppointmentCancelledEvent(this));
        }

        public void Completed()
        {
            Status.Complete(this);

            //AddDomainEvent(new AppointmentCompletedEvent(this));
        }

        public void AddImage(AppointmentImage image)
        {
            if (_images.Count >= Constants.AppointmentConstants.MaxImagesPerAppointment)
                throw new InvalidOperationException("Cannot add more than 5 images to an appointment.");

            _images.Add(image);
        }

        public void TransitionTo(AppointmentStatus newStatus)
        {
            Status = newStatus;
        }
    }
}
