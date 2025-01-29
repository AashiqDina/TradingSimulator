using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; } // Example table

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
}

public class User
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public decimal Balance { get; set; }
    // needs
    // array of owned stocks
    // daily profit
    // total profit
    // total invested
    // portfolio value
}
