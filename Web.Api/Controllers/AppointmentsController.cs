
using Application.Common.Interfaces;
using Application.Features.Appointments.Commands.CreateAppointment;
using Application.Features.Appointments.Commands.CreateConfirmedAppointment;
using Application.Features.Appointments.Queries.GetAppointments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private IMediator _mediator;
        private IIdentityProvider _identity;

        public AppointmentsController(IMediator mediator, IIdentityProvider currentUser)
        {
            _mediator = mediator;
            _identity = currentUser;
        }

        [Authorize]
        [HttpPost("request")]
        public async Task<IActionResult> RequestAppointmentAsync([FromBody] CreateAppointmentCommand command)
        {
            CreateAppointmentDto dto = await _mediator.Send(command);

            return Ok(dto);
        }

        [Authorize]
        [HttpPost("confirm/{id}")]
        public async Task<IActionResult> ConfirmRequestedAppointmentAsync([FromRoute] int id)
        {
            //CreateAppointmentDto dto = await _mediator.Send(command);

            //return Ok(dto);
            return Ok();
        }

        //TODO: role
        //[Authorize(Roles = "Admin, Owner")]
        //[Authorize]
        [HttpPost("confirmed")]
        public async Task<IActionResult> CreateConfirmedAsync([FromBody] CreateConfirmedAppointmentCommand command)
        {
            CreateConfirmedAppointmentDto dto = await _mediator.Send(command);

            return Ok(dto);
        }

        //[Authorize(Roles = "Artist")]
        [HttpGet("requested")]
        public async Task<ActionResult<GetAppointmentsDto>> ArtistGetRequestedAppointmentsAsync([FromQuery] ArtistGetRequestedAppointmentsQuery query)
        {
            query.ArtistId = _identity.UserId;

            GetAppointmentsDto dto = await _mediator.Send(query);

            return Ok(dto);
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> CancelAppointmentAsync([FromRoute] int id)
        {
            await _mediator.Send(new CancelAppointmentCommand { Id = id });

            return NoContent();
        }
    }
}
