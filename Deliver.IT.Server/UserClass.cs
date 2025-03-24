using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace Deliver.IT.Server
{
    public class UserClass : IdentityUser
    {
        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int UserRole {  get; set; }
        [JsonIgnore]
        public ICollection<Restaurant> ManagedRestaurants { get; set; } = new List<Restaurant>();
    }
}
