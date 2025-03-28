﻿using Deliver.IT.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Deliver.IT.Server
{
    public class DeliverItDbContext : IdentityDbContext<UserClass>
    {
        public DeliverItDbContext(DbContextOptions<DeliverItDbContext> options) : base(options)
        { }
        public DbSet<UserClass> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<OrderFood> OrderFoods { get; set; }
        public DbSet<CourierApplication> CourierApplications { get; set; } 
        public DbSet<Message> Messages { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<RestaurantRequest> RestaurantRequests { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserClass>(entity =>
            {
                entity.Property(u => u.UserName).IsRequired();
                entity.Property(u => u.FirstName).IsRequired();
                entity.Property(u => u.LastName).IsRequired();
                entity.Property(u => u.UserRole).IsRequired();
            });
            modelBuilder.Entity<UserClass>()
                .Property(u => u.UserRole)
                .HasConversion<string>();
   
            modelBuilder.Entity<UserClass>().HasData(
                new UserClass { FirstName = "Admin", LastName = "Adminovic", UserRole = 1 , UserName="admin"},
                new UserClass { FirstName = "Peter", LastName = "Facka", UserRole = 2, UserName = "cigorigo" },
                new UserClass { FirstName = "Roman", LastName = "Hladny", UserRole = 0, UserName = "romanek" }
            );

            modelBuilder.Entity<OrderFood>()
            .HasKey(of => new { of.OrderId, of.FoodId });

            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderFoods)  
                .WithOne()  
                .HasForeignKey(of => of.OrderId);

            modelBuilder.Entity<Order>()
                .Property(o => o.PhoneNumber)
                .IsRequired();

            modelBuilder.Entity<Order>()
                .Property(o => o.CreatedBy)
                .IsRequired();

            modelBuilder.Entity<Order>()
                .Property(o => o.ClaimedBy)
                .IsRequired(false);
            modelBuilder.Entity<OrderFood>()
                .HasOne<Food>()
                .WithMany(f => f.OrderFoods)
                .HasForeignKey(of => of.FoodId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Address>().HasData(
                new Address
                {
                    Id = 1,
                    Latitude = "0.0",
                    Longitude = "0.0",
                    City = "Sample City",
                    ConscriptionNumber = "123",
                    HouseNumber = "456",
                    Postcode = "78910",
                    Street = "Sample Street",
                    StreetNumber = "1",
                    Suburb = "Sample Suburb",
                    CompleteAddress = "Sample Street 1, Sample City"
                }
            );
            modelBuilder.Entity<Restaurant>().HasData(
                new Restaurant
                {
                    Id = 1,
                    Name = "Sample Restaurant",
                    AddressId = 1 // Reference the Address entity
                }
            );

            modelBuilder.Entity<Food>().HasData(
                new Food { Id = 1, Name = "McRoyal", Price = 20, PicturePath = "assets/mcroyal.jpg", RestaurantId = 1 },
                new Food { Id = 2, Name = "Banan", Price = 1, PicturePath = "assets/banan.jpg", RestaurantId = 1 },
                new Food { Id = 3, Name = "Adventny kalendar", Price = 2, PicturePath = "assets/kalendar.jpg", RestaurantId = 1 },
                new Food { Id = 4, Name = "Cokoladovy Mikulas", Price = 1, PicturePath = "assets/mikulas.jpg", RestaurantId = 1 },
                new Food { Id = 5, Name = "Pivo", Price = 1, PicturePath = "assets/pivo.jpg", RestaurantId = 1 }
            );

            // Configure Address and NodeTag entities
            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Latitude).IsRequired();
                entity.Property(a => a.Longitude).IsRequired();
            });
            modelBuilder.Entity<Restaurant>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Name).IsRequired();
                entity.HasOne(r => r.Address)
                      .WithMany()
                      .HasForeignKey("AddressId")
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(r => r.Orders)
                      .WithOne(o => o.Restaurant)
                      .HasForeignKey(o => o.RestaurantId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(r => r.Managers)
                      .WithMany(u => u.ManagedRestaurants);
            });
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }
    }
}
    

