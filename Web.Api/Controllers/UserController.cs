using Application.Features.Artists.Queries.GetAllArtitsts;
using Application.Features.Users.Queries.GetAllUsers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("artists")]
    public async Task<IActionResult> GetAllArtists()
    {
        return Ok(await _mediator.Send(new GetAllArtistsQuery()));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllUsersQuery()));
    }

}