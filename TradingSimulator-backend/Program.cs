using Microsoft.EntityFrameworkCore;
using TradingSimulator_Backend.Data;
using TradingSimulator_Backend.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",  // Make sure this name matches
        policy =>
        {
            // Make sure the frontend is using this IP address
            policy.WithOrigins("http://192.168.1.111:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSwaggerGen(options =>
{
    options.AddServer(new Microsoft.OpenApi.Models.OpenApiServer
    {
        Url = "http://192.168.1.111:5048",  // Your server's IP address here
        Description = "API Server"
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();

// Register IStockService and StockService
builder.Services.AddScoped<IStockService, StockService>();

builder.Services.AddHttpClient<StockService>(); // Register StockService with HttpClient

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Session expires after 30 minutes
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  // Enable Swagger in development mode
    app.UseSwaggerUI();  // Display Swagger UI to test API
}

app.UseRouting();
app.UseCors("AllowAll");
app.UseSession();
app.UseAuthorization();
app.MapControllers();

app.Run();
