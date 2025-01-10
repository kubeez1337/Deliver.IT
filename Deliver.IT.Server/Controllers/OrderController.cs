using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Deliver.IT.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DeliverItDbContext _context;

        public OrderController(DeliverItDbContext context)
        {
            _context = context;
        }

        //[HttpPost("/order")]
        //public async Task<ActionResult<Order>> CreateOrder(Order order)
        //{
        //    _context.Orders.Add(order);
        //    await _context.SaveChangesAsync();
        //    return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        //}
        [HttpPost("/create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            var order = new Order
            {
                CustomerName = model.CustomerName,
                CustomerAddress = model.CustomerAddress,
                PhoneNumber = model.PhoneNumber,
                CreatedBy = userId,
                OrderFoods = new List<OrderFood>()
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var foodItem in model.FoodItems)
            {
                var food = await _context.Foods.FindAsync(foodItem.FoodId);
                if (food == null)
                {
                    return BadRequest($"Food with ID {foodItem.FoodId} not found.");
                }
                OrderFood of = new OrderFood
                {
                    OrderId = order.Id,
                    FoodId = foodItem.FoodId,
                    Quantity = foodItem.Quantity,
                };
                _context.OrderFoods.Add(of);

                order.OrderFoods.Add(of);

            }
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpPut("/claim-order/{id}")]
        [Authorize(Roles = "2")]
        public async Task<IActionResult> ClaimOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            order.ClaimedBy = userId; 

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order claimed successfully!" });
        }

        public class CreateOrderModel
        {
            public string CustomerName { get; set; }
            public string CustomerAddress { get; set; }
            public string PhoneNumber { get; set; }
            public List<FoodItemModel> FoodItems { get; set; }
        }

        public class FoodItemModel
        {
            public int FoodId { get; set; }
            public int Quantity { get; set; }
        }

        [HttpGet("/order/{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = _context.Orders
            .Include(o => o.OrderFoods) 
            .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }
        [HttpGet("/orderFoods")]
        public async Task<ActionResult<IEnumerable<OrderFood>>> GetOrderFoods()
        {
            return await _context.OrderFoods.ToListAsync();
        }
        [HttpGet("/orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            IQueryable<Order> ordersQuery = _context.Orders.Include(o => o.OrderFoods);

            if (userRole == "0") 
            {
                ordersQuery = ordersQuery.Where(o => o.CreatedBy == userId);
            }
            else if (userRole == "2") 
            {
                ordersQuery = ordersQuery.Where(o => (o.ClaimedBy == userId) || (o.ClaimedBy == null));
            }
            else if (userRole == "1") 
            {
            }
            else
            {
                return Unauthorized();
            }
            var orders = await ordersQuery.ToListAsync();
            return Ok(orders);
        }

        [HttpPut("/orders/{id}")]
        public async Task<IActionResult> UpdateOrder(int id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("/orders/{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
        [HttpPut("/updateOrder")]
        [Authorize(Roles = "1")] 
        public async Task<IActionResult> UpdateOrder([FromBody] Order order)
        {
            if (order == null || order.Id <= 0)
            {
                return BadRequest("Invalid order data.");
            }

            var existingOrder = await _context.Orders.Include(o => o.OrderFoods).FirstOrDefaultAsync(o => o.Id == order.Id);
            if (existingOrder == null)
            {
                return NotFound("Order not found.");
            }

            existingOrder.CustomerName = order.CustomerName;
            existingOrder.CustomerAddress = order.CustomerAddress;
            existingOrder.PhoneNumber = order.PhoneNumber;

            existingOrder.OrderFoods.Clear();
            foreach (var orderFood in order.OrderFoods)
            {
                existingOrder.OrderFoods.Add(new OrderFood
                {
                    OrderId = order.Id,
                    FoodId = orderFood.FoodId,
                    Quantity = orderFood.Quantity
                });
            }

            _context.Orders.Update(existingOrder);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order updated successfully!" });
        }
    }
}
