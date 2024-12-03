using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Deliver.IT.Server
{
    public class DeliverItDbContext : IdentityDbContext<IdentityUser>
    {
        public DeliverItDbContext(DbContextOptions<DeliverItDbContext> options) : base(options)
        { }
        public DbSet<User> Users { get; set; }
        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);

        //    modelBuilder.Entity<User>()
        //        .Property(u => u.UserRole)
        //        .HasConversion<string>();

        //    modelBuilder.Entity<User>().HasData(
        //        new User { FirstName = "Admin", LastName = "Adminovic", UserRole = Role.Admin },
        //        new User { FirstName = "Peter", LastName = "Facka", UserRole = Role.Rozvozca },
        //        new User { FirstName = "Roman", LastName = "Hladny", UserRole = Role.Zakaznik }
        //    );

        //} 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the 'User' table
            modelBuilder.Entity<User>(entity =>
            {
                // Configure columns, relationships, etc. (if necessary)
                entity.Property(u => u.UserName).IsRequired();
                entity.Property(u => u.FirstName).IsRequired();
                entity.Property(u => u.LastName).IsRequired();
                entity.Property(u => u.UserRole).IsRequired();
            });
            modelBuilder.Entity<User>()
                .Property(u => u.UserRole)
                .HasConversion<string>();

            modelBuilder.Entity<User>().HasData(
                new User { FirstName = "Admin", LastName = "Adminovic", UserRole = Role.Admin , UserName="admin"},
                new User { FirstName = "Peter", LastName = "Facka", UserRole = Role.Rozvozca, UserName = "cigorigo" },
                new User { FirstName = "Roman", LastName = "Hladny", UserRole = Role.Zakaznik, UserName = "romanek" }
            );
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }
    }
}
    

