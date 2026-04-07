using Infrastructure.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Pobieramy wszystkich użytkowników z bazy
        var users = await _context.Users
            .AsNoTracking() // Dobra praktyka dla zapytań tylko do odczytu
            .ToListAsync();

        return Ok(users);
    }
}