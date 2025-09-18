using Microsoft.EntityFrameworkCore;
using TradingSimulator_Backend.Data;
using TradingSimulator_Backend.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", 
        policy =>
        {
            // Make sure the frontend is using localhost
            policy.WithOrigins("http://localhost:5048")  // Changed to localhost
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
        Url = "http://localhost:3000",  // Changed to localhost
        Description = "API Server"
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
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
