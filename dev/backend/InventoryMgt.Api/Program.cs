using InventoryMgt.Api.Extensions;  // This line must be included
using InventoryMgt.Api.Middlewares;
using InventoryMgt.Api.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.RegisterServices(builder.Configuration); // <--- updated line
var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
LoggerUtility.Initialize(logger);
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.ConfigureExceptionMiddleware();
app.MapControllers();

app.Run();
