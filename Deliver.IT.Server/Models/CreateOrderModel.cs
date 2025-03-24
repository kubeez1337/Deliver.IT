using static Deliver.IT.Server.Controllers.OrderController;

namespace Deliver.IT.Server.Models
{
    public class CreateOrderModel
    {
        public string CustomerName { get; set; }
        public Address CustomerAddress { get; set; }
        public string PhoneNumber { get; set; }
        public int RestaurantId { get; set; }
        public List<FoodItemModel> FoodItems { get; set; }
    }
}
