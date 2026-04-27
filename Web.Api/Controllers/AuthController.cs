using Application.Features.Authorization.Commands.Login;
using Application.Features.Users;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Web.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        public IActionResult Login()
        {
            return Challenge(new AuthenticationProperties { RedirectUri = "/" }, "Instagram");
        }

        [Authorize]
        public IActionResult Profile()
        {
            // Tutaj wyciągasz ID Instagrama, by znaleźć usera w swojej bazie
            var instagramId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Jeśli nie masz go w bazie -> stwórz nowy rekord "User" z tym ID
            // Jeśli masz -> zwróć jego dane
            return Ok(instagramId);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
