using Application.Features.Authorization;
using Application.Features.Authorization.Commands.Login;
using MediatR;
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

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("test-auth")]
        public IActionResult TestAuth()
        {
            var user = HttpContext.User;
            return Ok(new
            {
                IsAuthenticated = user.Identity?.IsAuthenticated,
                Name = user.Identity?.Name,
                Claims = user.Claims.Select(c => new { c.Type, c.Value }).ToList(),
                Role = user.FindFirstValue(ClaimTypes.Role)
            });
        }
    }
}
