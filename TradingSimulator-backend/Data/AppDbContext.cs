using Microsoft.EntityFrameworkCore;
using TradingSimulator_Backend.Models;

namespace TradingSimulator_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){
            
         }

        public DbSet<User> Users { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<Stock> Stocks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Portfolio>()
                .HasOne(p => p.User)
                .WithOne() // Assuming User doesn't have a navigation property for Portfolio
                .HasForeignKey<Portfolio>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Deletes Portfolio if User is deleted
        }
    }
}
