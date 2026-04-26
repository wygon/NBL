using Application.Features.Artists.Queries.GetAllArtitsts;
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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok();
    }

    [HttpGet("artists")]
    public async Task<IActionResult> GetAllArtists()
    {
        return Ok(await _mediator.Send(new GetAllArtistsQuery()));
    }
}