namespace Application.Common.Interfaces
{
    public interface IIdentityProvider
    {
        int UserId { get; }
        string? Username { get; }
        string? UserRole { get; }

        bool IsInRole(string roleName);
        bool HasClaim(string claimType, string claimValue);

        // Pobieranie konkretnego claima (np. email lub specyficzne uprawnienie)
        string? GetClaimValue(string claimType);
        bool IsAdmin => IsInRole("Admin");

        Task<bool> AuthorizeAsync(string policyName);
    }
}
