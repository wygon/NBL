using Application.Common.Interfaces;
using Application.Features.Notifications.Queries.GetNotifications;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IIdentityProvider _identity;

    public NotificationsController(IMediator mediator, IIdentityProvider identity)
    {
        _mediator = mediator;
        _identity = identity;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyAll()
    {
        return Ok(await _mediator.Send(new GetNotificationsQuery { UserId = _identity.UserId }));
    }
}