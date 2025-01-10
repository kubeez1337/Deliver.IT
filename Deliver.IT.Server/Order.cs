using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Deliver.IT.Server
{
    
    
    public class Order
    {
        public int Id { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerAddress { get; set; }

        [RegularExpression(@"^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$", ErrorMessage = "Invalid format")]
        public string? PhoneNumber { get; set; }
        public string CreatedBy { get; set; }
        public string? ClaimedBy { get; set; }
        public ICollection<OrderFood> OrderFoods { get; set; } = new List<OrderFood>();
    }

    public class OrderFood
    {
        public int OrderId { get; set; }
        public int FoodId { get; set; }
        public int Quantity { get; set; }
    }
    public class Food
    {
        public int Id { get; set; }
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        [JsonPropertyName("price")]
        public decimal Price { get; set; }
        public ICollection<OrderFood>? OrderFoods { get; set; }
    }
}
