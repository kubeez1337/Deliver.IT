namespace Deliver.IT.Server.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly DeliverItDbContext _context;
        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, DeliverItDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        [HttpPost("/register")]
        public async Task<IActionResult> Register(string username, string email, string password)
        {
            var user = new User { UserName = username, Email = email , UserRole = Role.Zakaznik};
            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                return Ok("User registered successfully!");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("/login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            var result = await _signInManager.PasswordSignInAsync(username, password, isPersistent: false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                return Ok("Login successful!");
            }

            return Unauthorized("Invalid username or password.");
        }

        [HttpGet("/getUsers")]
        //[Authorize(Roles = "Role.Admin")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.FirstName,
                    u.LastName,
                    u.PhoneNumber,
                    u.Email,
                    u.UserRole,
                    u.PasswordHash
                })
                .ToListAsync();

            if (users == null || users.Count == 0)
            {
                return NotFound("No users found.");
            }

            return Ok(users);
        }
    }
}
