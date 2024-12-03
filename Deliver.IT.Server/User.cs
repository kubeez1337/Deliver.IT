namespace Deliver.IT.Server
{
    public enum Role
    {
        Rozvozca, 
        Admin,
        Zakaznik
    }
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Role UserRole {  get; set; }
        
    }
}
