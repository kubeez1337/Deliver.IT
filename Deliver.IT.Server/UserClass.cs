using Microsoft.AspNetCore.Identity;

namespace Deliver.IT.Server
{
    public class UserClass : IdentityUser
    {
        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        
        public int UserRole {  get; set; }
        

    }
}
