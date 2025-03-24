using Deliver.IT.Server;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class RestaurantController : ControllerBase
{
    private readonly DeliverItDbContext _context;

    public RestaurantController(DeliverItDbContext context)
    {
        _context = context;
    }

    [HttpPost("/request-restaurant")]
    [Authorize]
    public async Task<IActionResult> RequestRestaurant([FromBody] RestaurantRequest request)
    {
        if (request == null)
        {
            return BadRequest("Invalid restaurant request data.");
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("User ID not found in token.");
        }

        request.RequestedBy = userId;

        // Ensure the Address entity is not duplicated
        var existingAddress = await _context.Addresses.FindAsync(request.Address.Id);
        if (existingAddress == null)
        {
            return BadRequest("Address not found.");
        }

        request.Address = existingAddress;

        _context.RestaurantRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Restaurant request submitted successfully!" });
    }

    [HttpGet("/pending-restaurant")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> GetPendingRequests()
    {
        var requests = await _context.RestaurantRequests
            .Include(r => r.Address) // Include the Address data
            .Where(r => !r.IsApproved)
            .ToListAsync();
        return Ok(requests);
    }

    [HttpPost("/approve-restaurant")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> ApproveRequest([FromBody] int requestId)
    {
        var request = await _context.RestaurantRequests
        .Include(r => r.Address) // Include the Address data
        .FirstOrDefaultAsync(r => r.Id == requestId);
        if (request == null)
        {
            return NotFound("Restaurant request not found.");
        }

        request.IsApproved = true;
        var restaurant = new Restaurant
        {
            Name = request.Name,
            AddressId = request.Address.Id // Use the existing AddressId
        };

        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Restaurant request approved and restaurant created successfully!" });
    }

    [HttpPost("/reject-restaurant")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> RejectRequest([FromBody] int requestId)
    {
        var request = await _context.RestaurantRequests.FindAsync(requestId);
        if (request == null)
        {
            return NotFound("Restaurant request not found.");
        }

        _context.RestaurantRequests.Remove(request);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Restaurant request rejected successfully!" });
    }
    [HttpGet("/getRestaurants")]
    public async Task<IActionResult> GetRestaurants()
    {
        var restaurants = await _context.Restaurants
            .Include(r => r.Address) // Include the Address data
            .ToListAsync();
        return Ok(restaurants);
    }
    [HttpPost("/add-manager")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> AddManager([FromBody] AddManagerModel model)
    {
        var user = await _context.Users.FindAsync(model.UserId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var restaurant = await _context.Restaurants.FindAsync(model.RestaurantId);
        if (restaurant == null)
        {
            return NotFound("Restaurant not found.");
        }

        user.UserRole = 3;
        restaurant.Managers.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Manager added successfully!" });
    }
    [HttpGet("/managed-restaurants")]
    [Authorize(Roles = "1, 3")]
    public async Task<IActionResult> GetManagedRestaurants()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("User ID not found in token.");
        }
        var user = await _context.Users
            .Include(u => u.ManagedRestaurants)
            .FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        return Ok(user.ManagedRestaurants);
    }

}