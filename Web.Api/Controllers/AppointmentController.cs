
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
    public class AppointmentController : ControllerBase
    {
        private IMediator _mediator;
        private IUser _currentUser;

        public AppointmentController(IMediator mediator, IUser currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
        }

        [Authorize]
        [HttpPost("request")]
        public async Task<IActionResult> RequestAppointmentAsync([FromBody] CreateAppointmentCommand command)
        {
            CreateAppointmentDto dto = await _mediator.Send(command);

            return Ok(dto);
        }

        //TODO: role
        //[Authorize(Roles = "Admin,Owner")]
        [Authorize]
        [HttpPost("confirmed")]
        public async Task<IActionResult> CreateConfirmedAsync([FromBody] CreateConfirmedAppointmentCommand command)
        {
            CreateConfirmedAppointmentDto dto = await _mediator.Send(command);

            return Ok(dto);
        }

        [Authorize]
        [HttpGet("my-appointments")]
        public async Task<ActionResult<GetAppointmentsDto>> GetMyAppointments([FromQuery] GetAppointmentsQuery query)
        {
            query.UserId = _currentUser.Id;

            GetAppointmentsDto dto = await _mediator.Send(query);

            return Ok(dto);
        }
    }
}
