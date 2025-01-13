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
        private readonly UserManager<UserClass> _userManager;
        private readonly SignInManager<UserClass> _signInManager;
        private readonly DeliverItDbContext _context;
        public AccountController(UserManager<UserClass> userManager, SignInManager<UserClass> signInManager, DeliverItDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        [HttpPost("/register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            var user = new UserClass {
                UserName = model.Username,
                Email = model.Email,
                UserRole = 0,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber
            };
            if (user.UserName == "adminer")
            {
                user.UserRole = 1;
            }
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "User registered successfully!" });
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
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, roleName)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = "https://localhost:59038",
                Audience = "https://localhost:59038",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var newKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("mySecretKey1234567890abcdef12345678"));
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var creds = new SigningCredentials(newKey, SecurityAlgorithms.HmacSha256);
            var new_token = new JwtSecurityToken(issuer: "https://localhost:59038", audience: "https://localhost:59038", claims: claims, expires: DateTime.Now.AddMinutes(30), signingCredentials: creds);
            //await _signInManager.SignInAsync(user, false);
            tokenHandler.WriteToken(new_token);
            return Ok(new { Token = tokenHandler.WriteToken(new_token), Role = user.UserRole });
        }


        [HttpGet("/getUser")]
        [Authorize]
        public async Task<IActionResult> GetUser() {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return NotFound("User ID not found in token.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(new
            {
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                UserRole = user.UserRole
            });
        }

        [HttpGet("/getUsers")]
        [Authorize(Roles ="1")]
        public async Task<IActionResult> GetUsers()
        {
            var user = await _userManager.GetUserAsync(User);
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            Console.WriteLine($"User role: {role}");
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
        [HttpPut("/updateUser")]
        [Authorize]
        public async Task<IActionResult> UpdateUser([FromBody] UserClass updatedUser)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return NotFound("User ID not found in token.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.PhoneNumber = updatedUser.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { message = "User information updated successfully!" });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }

            return BadRequest(ModelState);
        }
        [HttpPost("/applyForCourier")]
        [Authorize]
        public async Task<IActionResult> ApplyForCourier([FromBody] CourierApplicationModel model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return NotFound("User ID not found in token.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var existingApplication = await _context.CourierApplications.FirstOrDefaultAsync(a => a.UserId == userId);
            if (existingApplication != null)
            {
                return BadRequest("You already have a pending application.");
            }

            var application = new CourierApplication
            {
                UserId = userId,
                UserName = user.UserName,
                Message = model.Message
            };

            _context.CourierApplications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Courier role application submitted successfully!" });
        }
        [HttpGet("/getCourierApplications")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> GetCourierApplications()
        {
            var applications = await _context.CourierApplications.ToListAsync();
            return Ok(applications);
        }

        [HttpPost("/processCourierApplication")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> ProcessCourierApplication([FromBody] ProcessCourierApplicationModel model)
        {
            var application = await _context.CourierApplications.FindAsync(model.ApplicationId);
            if (application == null)
            {
                return NotFound("Application not found.");
            }

            if (model.Approve)
            {
                var user = await _userManager.FindByIdAsync(application.UserId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                user.UserRole = 2;
                await _userManager.UpdateAsync(user);
            }

            _context.CourierApplications.Remove(application);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Application processed successfully!" });
        }

    }
}
