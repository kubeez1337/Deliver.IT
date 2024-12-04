namespace Deliver.IT.Server.Controllers
{
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using Deliver.IT.Server.Models;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;

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
            var user = new UserClass { UserName = username, Email = email , UserRole = 0};
            if (user.UserName == "adminer")
            {
                user.UserRole = 1;
            }
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
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username) as UserClass;
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized("Invalid username or password.");
            }
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("mySecretKey1234567890abcdef12345678");

            var roleName = user.UserRole.ToString();
            if (string.IsNullOrEmpty(roleName))
            {
                return BadRequest("User role is missing.");
            }

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Role, roleName)
    };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { Token = tokenHandler.WriteToken(token) });
        }


        [HttpGet("/getUser")]
        public async Task<IActionResult> GetUser() { 
            var user = await _userManager.GetUserAsync(User);
            return Ok(user.UserName);
        
        }

        [HttpGet("/getUsers")]
        //[Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> GetUsers()
        {
            //if (!User.Identity.IsAuthenticated)
            //{
            //    return Unauthorized("User not authenticated");
            //}
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role != "1")
            {
                return Forbid("User is not an admin.");
            }
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
