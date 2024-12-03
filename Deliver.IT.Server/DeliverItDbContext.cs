using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Deliver.IT.Server
{
    public class DeliverItDbContext : IdentityDbContext<IdentityUser>
    {
        public DeliverItDbContext(DbContextOptions<DeliverItDbContext> options) : base(options) { 
        
        
        
        }
    }
}
