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
        public NailService? NailService { get; private set; }
        public NailSize? NailSize { get; private set; }
        public NailForm? NailForm { get; private set; }
        public List<NailAddons>? NailAddons { get; private set; }
        public string? AdditionalNotesUser { get; private set; }
        public string? AdditionalNotesArtist { get; private set; }

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
                Status = new RequestedStatus()
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

        public void ConfirmWithModifications(DateTime confirmedFrom,
            DateTime confirmedTo,
            NailService? service,
            NailSize? size,
            NailForm? form,
            List<NailAddons>? addons,
            string? artistNote)
        {
            Status.Confirm(this);

            From = confirmedFrom;
            To = confirmedTo;
            NailService = service;
            NailSize = size;
            NailForm = form;
            NailAddons = addons;
            AdditionalNotesArtist = artistNote;

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
