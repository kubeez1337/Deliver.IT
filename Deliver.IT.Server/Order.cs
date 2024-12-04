namespace Deliver.IT.Server
{
    
    
    public class Order
    {
        public int Id { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerAddress { get; set; }
        public string? DeliveryGuy { get; set; }

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
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public ICollection<OrderFood>? OrderFoods { get; set; }
    }
}
