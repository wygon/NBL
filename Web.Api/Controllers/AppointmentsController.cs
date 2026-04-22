
using Application.Common.Interfaces;
using Application.Features.Appointments;
using Application.Features.Appointments.Commands.AddAppointmentPhoto;
using Application.Features.Appointments.Commands.CancelConfirmedAppointment;
using Application.Features.Appointments.Commands.ConfirmAppointment;
using Application.Features.Appointments.Commands.CreateAppointment;
using Application.Features.Appointments.Commands.CreateConfirmedAppointment;
using Application.Features.Appointments.Commands.FinishAppointment;
using Application.Features.Appointments.Queries.GetAppointmentBookingData;
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

        //[Authorize(Policy = Policies.User)]
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
        //[Authorize(Policy = Policies.Artist)]
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

        [HttpGet]
        public async Task<ActionResult<GetAppointmentsDto>> GetAppointmentsAsync([FromQuery] GetAppointmentsQuery query)
        {
            GetAppointmentsDto dto = await _mediator.Send(query);

            return Ok(dto);
        }

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

        #endregion

        //[Authorize(Policy = Policies.AdminOnly)]
        //[HttpGet]
        //public async Task<ActionResult<GetAppointmentsDto>> GetAppointmentsAsync([FromQuery] GetAppointmentsQuery query)
        //{
        //    GetAppointmentsDto dto = await _mediator.Send(query);

        //    return Ok(dto);
        //}

        [HttpPost("{id}/photos")]
        public async Task<ActionResult<List<AddAppointmentPhotoDto>>> AddAppointmentPhotoAsync([FromRoute] int id, [FromForm] AddAppointmentPhotoCommand command)
        {
            if (id != command.AppointmentId)
                return BadRequest("ID w adresie URL nie zgadza się z ID w obiekcie.");

            List<AddAppointmentPhotoDto> dto = await _mediator.Send(command);
            return Ok(dto);
        }

        [HttpGet("booking-data")]
        public async Task<ActionResult<BookingDataDto>> GetBookingDataAsync()
        {
            return Ok(await _mediator.Send(new GetAppointmentBookingDataQuery()));
        }
    }
}
