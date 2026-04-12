
using Application.Common.Interfaces;
using Application.Features.Appointments.Commands.AddAppointmentPhoto;
using Application.Features.Appointments.Commands.CancelConfirmedAppointment;
using Application.Features.Appointments.Commands.ConfirmAppointment;
using Application.Features.Appointments.Commands.CreateAppointment;
using Application.Features.Appointments.Commands.CreateConfirmedAppointment;
using Application.Features.Appointments.Queries.GetAppointments;
using Domain.Constants;
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

        #region Client

        [Authorize(Policy = Policies.User)]
        [HttpGet("my")]
        public async Task<ActionResult<GetAppointmentsDto>> GetMyAppointmentsAsync([FromQuery] GetAppointmentsQuery query)
        {
            query.RequestedByUserId = _identity.UserId;
            GetAppointmentsDto dto = await _mediator.Send(query);

            return Ok(dto);
        }

        [Authorize(Policy = Policies.User)]
        [HttpPost]
        public async Task<IActionResult> RequestAppointmentAsync([FromBody] CreateAppointmentCommand command)
        {
            CreateAppointmentDto dto = await _mediator.Send(command);

            return Ok(dto);
        }

        [Authorize]
        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> CancelAppointmentAsync([FromRoute] int id)
        {
            await _mediator.Send(new CancelAppointmentCommand() { Id = id });

            return NoContent();
        }

        #endregion

        #region Artist
        [Authorize(Policy = Policies.Artist)]
        [HttpPut("confirm/{id}")]
        public async Task<IActionResult> ConfirmRequestedAppointmentAsync([FromRoute] int id, [FromBody] ConfirmAppointmentCommand command)
        {
            if (id != command.AppointmentId)
            {
                return BadRequest("ID w adresie URL nie zgadza się z ID w obiekcie.");
            }

            await _mediator.Send(command);

            return NoContent();
        }

        [Authorize(Policy = Policies.CanManageAppointments)]
        [HttpPost("confirmed")]
        public async Task<IActionResult> CreateConfirmedAsync([FromBody] CreateConfirmedAppointmentCommand command)
        {
            CreateConfirmedAppointmentDto dto = await _mediator.Send(command);

            return Ok(dto);
        }

        [Authorize(Policy = Policies.Artist)]
        [HttpGet("requested")]
        public async Task<ActionResult<GetAppointmentsDto>> ArtistGetRequestedAppointmentsAsync([FromQuery] GetAppointmentsQuery query)
        {
            query.ArtistId = _identity.UserId;

            GetAppointmentsDto dto = await _mediator.Send(query);

            return Ok(dto);
        }

        #endregion

        [Authorize(Policy = Policies.AdminOnly)]
        [HttpGet]
        public async Task<ActionResult<GetAppointmentsDto>> GetAppointmentsAsync([FromQuery] GetAppointmentsQuery query)
        {
            GetAppointmentsDto dto = await _mediator.Send(query);

            return Ok(dto);
        }

        [HttpPost("{id}/photos")]
        public async Task<ActionResult<List<AddAppointmentPhotoDto>>> AddAppointmentPhotoAsync([FromRoute] int id, [FromForm] AddAppointmentPhotoCommand command)
        {
            if (id != command.AppointmentId)
                return BadRequest("ID w adresie URL nie zgadza się z ID w obiekcie.");

            List<AddAppointmentPhotoDto> dto = await _mediator.Send(command);
            return Ok(dto);
        }
    }
}
