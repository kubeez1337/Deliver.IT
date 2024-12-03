using Microsoft.AspNetCore.Identity;

namespace Deliver.IT.Server
{
    public enum Role
    {
        Rozvozca, 
        Admin,
        Zakaznik
    }
    public class User : IdentityUser
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        //public required string Username {  get; set; }
        //public string PhoneNumber {  get; set; }
        //public string Email { get; set; }
        //public string Password {  get; set; }
        public Role UserRole {  get; set; }
        

    }
}
