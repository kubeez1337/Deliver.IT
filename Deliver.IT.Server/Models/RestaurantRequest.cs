using Deliver.IT.Server;

public class RestaurantRequest
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Address Address { get; set; }
    public string RequestedBy { get; set; }
    public bool IsApproved { get; set; } = false;
}