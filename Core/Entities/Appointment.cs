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
        public List<DateTimeFromTo>? RequestedDates { get; init; }
        public AppointmentStatus Status { get; private set; }
        public DateTime? From { get; init; } = null;
        public DateTime? To { get; init; } = null;
        public NailService? NailService { get; init; }
        public NailSize? NailSize { get; init; }
        public NailForm? NailForm { get; init; }
        public List<NailAddons>? NailAddons { get; init; }
        public string? AdditionalNotesUser { get; init; }
        public string? AdditionalNotesArtist { get; init; }

        public int ArtistId { get; init; }
        public int UserId { get; init; }
        public int RecipeId { get; init; }

        //CHECK: chat poleca sie ich pozbyc i mowi ze nie sa potrzebne dla ef core
        //public User Artist { get; init; }
        //public User Customer { get; init; }
        //public Recipe Recipe { get; init; }

        private Appointment(int artistId, int userId, AppointmentStatus status, List<DateTimeFromTo> requestedDates,
            NailService? nailService, NailSize? nailSize, NailForm? nailForm, List<NailAddons> nailAddons, string additionalNotes, DateTime? from = null, DateTime? to = null)
        {
            ArtistId = artistId;
            UserId = userId;
            Status = status;
            RequestedDates = requestedDates;
            NailService = nailService;
            NailSize = nailSize;
            NailForm = nailForm;
            NailAddons = nailAddons;
            AdditionalNotesUser = additionalNotes;
            From = from;
            To = to;
        }

        private Appointment()
        {

        }

        public static Appointment RequestAppointment(int artistId, int userId, List<DateTimeFromTo> requestedDates,
            NailService? nailService, NailSize? nailSize, NailForm? nailForm, List<NailAddons> nailAddons, string additionalNotes)
        {
            Appointment request = new Appointment()
            {
                ArtistId = artistId,
                UserId = userId,
                RequestedDates = requestedDates,
                NailService = nailService,
                NailSize = nailSize,
                NailForm = nailForm,
                NailAddons = nailAddons,
                AdditionalNotesUser = additionalNotes,
                Status = new PendingStatus()
            };

            request.AddDomainEvent(new AppointmentCreatedEvent(request));

            return request;
        }

        public static Appointment CreateConfirmed(int artistId, int userId, DateTimeFromTo dateFromTo,
            NailService? nailService, NailSize? nailSize, NailForm? nailForm, List<NailAddons> nailAddons, string additionalNotes)
        {
            Appointment appointment = new Appointment(artistId, userId, new ConfirmedStatus(), null!, nailService, nailSize,
                nailForm, nailAddons, additionalNotes, dateFromTo.From, dateFromTo.To);

            appointment.AddDomainEvent(new AppointmentConfirmedEvent(appointment));

            return appointment;
        }

        public void Confirm()
        {
            Status.Confirm(this);

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

        public void TransitionTo(AppointmentStatus newStatus)
        {
            Status = newStatus;
        }
    }
}
