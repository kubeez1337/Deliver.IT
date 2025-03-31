using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Deliver.IT.Server
{
    
    
    public class Order
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public Address CustomerAddress { get; set; }

        [RegularExpression(@"^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$", ErrorMessage = "Invalid format")]
        public string PhoneNumber { get; set; }
        public string CreatedBy { get; set; }
        public string? ClaimedBy { get; set; }
        public string? ClaimedByName { get; set; }
        public string Status { get; set; } = "Waiting for courier";
        public int RestaurantId { get; set; }
        [JsonIgnore]
        public Restaurant Restaurant { get; set; }
        public ICollection<OrderFood> OrderFoods { get; set; } = new List<OrderFood>();
        public decimal TotalPrice { get; set; }
        public void CalculateTotalPrice()
        {
            TotalPrice = OrderFoods.Sum(of => of.FoodPrice * of.Quantity);
        }
        public string TimeCreated { get; set; } = DateTime.Now.ToString();
        public string? TimeClaimed { get; set; }
        public string? TimeDelivered { get; set; }
    }

    public class OrderFood
    {
        public int OrderId { get; set; }
        public int FoodId { get; set; }
        public string FoodName { get; set; }
        public decimal FoodPrice { get; set; }
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
        public string? PicturePath { get; set; }
        public int RestaurantId { get; set; }
        public Restaurant? Restaurant { get; set; }
    }
    public class Restaurant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Address Address { get; set; }
        public int AddressId { get; set; }
        [JsonIgnore]
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        [JsonIgnore]
        public ICollection<UserClass> Managers { get; set; } = new List<UserClass>();
        public ICollection<Food> Foods { get; set; } = new List<Food>();
    }
}
