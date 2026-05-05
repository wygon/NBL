using Application.Common.Interfaces;
using Domain.Constants;
using Domain.Entities;

namespace Application.Common.Extensions
{
    public static class IdentityExtensions
    {
        public static async Task<bool> CanAccessAppointment(this IIdentityProvider identity, Appointment appointment)
        {
            if (identity.IsAdmin || await identity.AuthorizeAsync(Policies.CanManageAppointments))
                return true;

            if (appointment.CustomerId == identity.UserId)
                return true;

            if (appointment.ArtistId == identity.UserId)
                return true;

            return false;
        }
    }
}
