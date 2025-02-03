using Microsoft.AspNetCore.Mvc;
using TradingSimulatorAPI.Models;
using Microsoft.EntityFrameworkCore;
using TradingSimulatorAPI.Data;


namespace TradingSimulatorAPI.Controllers
{
    [ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent(); // This means the user was deleted successfully.
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser([FromBody] User user)
    {
        // Check if the user already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
        if (existingUser != null)
        {
            return BadRequest(new { success = false, message = "Username already taken." });
        }

        // If no user exists, create a new one
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "User registered successfully." });
    }

    [HttpPost("checkUsername")]
    public async Task<IActionResult> CheckUsername([FromBody] UsernameCheckRequest request)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Username == request.Username);

        return Ok(new { exists = userExists });
    }
}
}
