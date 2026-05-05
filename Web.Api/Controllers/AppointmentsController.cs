using Application.Common.Interfaces;
using Application.Features.Appointments;
using Application.Features.Appointments.Commands.AddAppointmentPhoto;
using Application.Features.Appointments.Commands.CancelConfirmedAppointment;
using Application.Features.Appointments.Commands.ChangeAppointmentArtist;
using Application.Features.Appointments.Commands.ConfirmAppointment;
using Application.Features.Appointments.Commands.CreateAppointment;
using Application.Features.Appointments.Commands.CreateConfirmedAppointment;
using Application.Features.Appointments.Commands.FinishAppointment;
using Application.Features.Appointments.Commands.TakeAppointment;
using Application.Features.Appointments.Queries.GetAppointmentBookingData;
using Application.Features.Appointments.Queries.GetAppointments;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers
{
    [Authorize]
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

        #region Public and Basic Client
        [AllowAnonymous]
        [HttpGet("booking-data")]
        public async Task<ActionResult<BookingDataDto>> GetBookingDataAsync()
        {
            return Ok(await _mediator.Send(new GetAppointmentBookingDataQuery()));
        }

        [HttpGet("my")]
        public async Task<ActionResult<GetAppointmentsDto>> GetMyAppointmentsAsync([FromQuery] GetAppointmentsQuery query)
        {
            query.RequestedByUserId = _identity.UserId;
            GetAppointmentsDto dto = await _mediator.Send(query);

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> RequestAppointmentAsync([FromBody] CreateAppointmentCommand command)
        {
            CreateAppointmentDto dto = await _mediator.Send(command);

            return Ok(dto);
        }

        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> CancelAppointmentAsync([FromRoute] int id)
        {
            await _mediator.Send(new CancelAppointmentCommand() { Id = id });

            return NoContent();
        }

        #endregion

        #region Artist and Manager
        [Authorize(Policy = Policies.Artist)]
        [HttpPut("confirm/{id}")]
        public async Task<IActionResult> ConfirmRequestedAppointmentAsync([FromRoute] int id, [FromBody] AppointmentDto request)
        {
            if (request.From == null || request.To == null)
                return BadRequest("Pole 'From' i 'To' są wymagane.");

            var command = new ConfirmAppointmentCommand
            {
                AppointmentId = id,
                From = request.From.Value,
                To = request.To.Value,
                ArtistId = request.ArtistId,
                ServiceId = request.Service?.Id,
                VariantId = request.Variant?.Id,
                AddonIds = request.Addons?.Select(a => a.Id).ToList(),
                NailSize = request.NailSize,
                AdditionalNotesArtist = request.AdditionalNotesArtist,
                //TotalPrice = request.TotalPrice,
                //TotalDurationInMinutes = request.TotalDurationInMinutes
            };

            // Wysyłamy gotową, poprawną komendę do warstwy Application
            await _mediator.Send(command);

            return NoContent(); // 204 No Content - standard dla operacji PUT
        }

        [Authorize(Policy = Policies.Artist)]
        [HttpGet("requested")]
        public async Task<ActionResult<GetAppointmentsDto>> ArtistGetRequestedAppointmentsAsync([FromQuery] GetAppointmentsQuery query)
        {
            query.ArtistId = _identity.UserId;

            GetAppointmentsDto dto = await _mediator.Send(query);

            return Ok(dto);
        }

        [Authorize(Policy = Policies.Artist)]
        [HttpPut("{id}/finish")]
        public async Task<ActionResult> FinishAppointmentAsync([FromRoute] int id)
        {
            FinishAppointmentCommand command = new FinishAppointmentCommand
            {
                AppointmentId = id
            };

            await _mediator.Send(command);

            return NoContent(); // Dla PUT zazwyczaj zwraca się 204 NoContent, ale Ok() (200) też jest w porządku
        }

        [Authorize(Policy = Policies.Artist)]
        [HttpPut("{id}/take")]
        public async Task<IActionResult> TakeAppointment([FromRoute] int id)
        {
            TakeAppointmentCommand command = new TakeAppointmentCommand
            {
                AppointmentId = id
            };

            await _mediator.Send(command);

            return CreatedAtAction(nameof(TakeAppointment), new { id = command.AppointmentId }, null);
        }

        #endregion

        #region Manager / Admin

        [Authorize(Policy = Policies.CanManageAppointments)]
        [HttpPost("confirmed")]
        public async Task<IActionResult> CreateConfirmedAsync([FromBody] CreateConfirmedAppointmentCommand command)
        {
            CreateConfirmedAppointmentDto dto = await _mediator.Send(command);

            return Ok(dto);
        }

        [Authorize(Policy = Policies.CanManageAppointments)]
        [HttpPut("artist")]
        public async Task<IActionResult> ChangeArtist([FromBody] ChangeAppointmentArtistCommand command)
        {
            await _mediator.Send(command);

            return NoContent();
        }

        //[Authorize(Policy = Policies.CanManageAppointments)]
        [HttpGet]
        public async Task<ActionResult<GetAppointmentsDto>> GetAppointmentsAsync([FromQuery] GetAppointmentsQuery query)
        {
            return Ok(await _mediator.Send(query));
        }

        #endregion

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
