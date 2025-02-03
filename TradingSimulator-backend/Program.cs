using Microsoft.EntityFrameworkCore;
using TradingSimulatorAPI.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")  // Allow frontend's origin
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  // Enable Swagger in development mode
    app.UseSwaggerUI();  // Display Swagger UI to test API
}

app.UseRouting();
app.UseAuthorization();
app.UseCors("AllowLocalhost");
app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
app.MapControllers();


app.Run();
