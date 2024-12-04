using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    }
}
