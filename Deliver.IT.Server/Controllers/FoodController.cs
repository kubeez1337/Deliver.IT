using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Deliver.IT.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FoodController : ControllerBase
    {
        private readonly DeliverItDbContext _context;
        public FoodController(DeliverItDbContext context)
        {
            _context = context;
        }

        [HttpGet("/getFoods")]
        public async Task<ActionResult<IEnumerable<Food>>> GetFoods()
        {
            return await _context.Foods.ToListAsync();
        }

        [HttpPost("/uploadFoods")]
        [Authorize(Roles = "1")] 
        public async Task<IActionResult> UploadFoods(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            try
            {
                using (var stream = new StreamReader(file.OpenReadStream()))
                {
                    var json = await stream.ReadToEndAsync();
                    var foods = JsonSerializer.Deserialize<List<Food>>(json);

                    if (foods == null || !foods.Any())
                    {
                        return BadRequest("Invalid JSON format or empty list.");
                    }

                    var validationErrors = ValidateFoods(foods);
                    if (validationErrors.Any())
                    {
                        return BadRequest(new { message = "Validation errors", errors = validationErrors });
                    }

                    foreach (var food in foods)
                    {
                        var existingFood = await _context.Foods.AsNoTracking().FirstOrDefaultAsync(f => f.Id == food.Id);
                        if (existingFood != null)
                        {
                            _context.Entry(existingFood).State = EntityState.Detached;
                            _context.Entry(food).State = EntityState.Modified;
                        }
                        else
                        {
                            _context.Foods.Add(food);
                        }
                    }

                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Foods uploaded successfully!" });
                
                }
            }
            
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private List<string> ValidateFoods(List<Food> foods)
        {
            var errors = new List<string>();

            foreach (var food in foods)
            {
                if (string.IsNullOrWhiteSpace(food.Name))
                {
                    errors.Add($"Food with ID {food.Id} has an invalid name.");
                }

                if (food.Price <= 0)
                {
                    errors.Add($"Food with ID {food.Id} has an invalid price.");
                }
            }

            return errors;
        }
        [HttpGet("/exportFoods")]
        [Authorize(Roles = "1")] 
        public async Task<IActionResult> ExportFoods()
        {
            var foods = await _context.Foods.ToListAsync();
            var json = JsonSerializer.Serialize(foods);

            var fileName = "foods.json";
            var fileBytes = System.Text.Encoding.UTF8.GetBytes(json);

            return File(fileBytes, "application/json", fileName);
        }

        [HttpPut("/updateFood")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> UpdateFood([FromBody] Food food)
        {
            if (food == null || food.Id <= 0)
            {
                return BadRequest("Invalid food data.");
            }

            var existingFood = await _context.Foods.FindAsync(food.Id);
            if (existingFood == null)
            {
                return NotFound("Food not found.");
            }

            existingFood.Name = food.Name;
            existingFood.Price = food.Price;

            _context.Foods.Update(existingFood);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Food updated successfully!" });
        }

        [HttpPut("/updateFoods")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> UpdateFoods([FromBody] List<Food> foods)
        {
            if (foods == null || !foods.Any())
            {
                return BadRequest("Invalid food data.");
            }

            foreach (var food in foods)
            {
                var existingFood = await _context.Foods.FindAsync(food.Id);
                if (existingFood == null)
                {
                    return NotFound($"Food with ID {food.Id} not found.");
                }

                existingFood.Name = food.Name;
                existingFood.Price = food.Price;

                _context.Foods.Update(existingFood);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Foods updated successfully!" });
        }
        [HttpDelete("/deleteFoods")]
        [Authorize(Roles = "1")] 
        public async Task<IActionResult> DeleteFoods([FromBody] List<int> foodIds)
        {
            if (foodIds == null || !foodIds.Any())
            {
                return BadRequest("Invalid food IDs.");
            }

            var foodsToDelete = await _context.Foods.Where(f => foodIds.Contains(f.Id)).ToListAsync();
            if (!foodsToDelete.Any())
            {
                return NotFound("No foods found to delete.");
            }
            var orderFoodsToDelete = await _context.OrderFoods.Where(of => foodIds.Contains(of.FoodId)).ToListAsync();
            _context.OrderFoods.RemoveRange(orderFoodsToDelete);
            _context.Foods.RemoveRange(foodsToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Foods deleted successfully!" });
        }
        [HttpPost("/addFoods")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> AddFoods([FromBody] Food[] foods)
        {
            if (foods == null || !foods.Any())
            {
                return BadRequest("Invalid food data.");
            }

            foreach (var food in foods)
            {
                if (string.IsNullOrWhiteSpace(food.Name) || food.Price <= 0)
                {
                    return BadRequest($"Invalid data for food with ID {food.Id}.");
                }

                _context.Foods.Add(food);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Foods added successfully!" });
        }
    }

}
