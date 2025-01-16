using InventoryMgt.Api.Middlewares;
using InventoryMgt.Api.Utils;
using InventoryMgt.Data.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace InventoryMgt.Api.Extensions;

public static class ServiceRegistratonExtension
{
    public static IServiceCollection RegisterServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddTransient<ICategoryRepository, CategoryRepository>();
        services.AddTransient<IProductRepository, ProductRepository>();
        services.AddTransient<IPurchaseRepository, PurchaseRepository>();
        services.AddTransient<IAuthenticationRepository, AuthenticationRepository>();
        services.AddTransient<IStockRepository, StockRepository>();
        services.AddTransient<ISaleRepository, SaleRepository>();
        services.AddTransient<ExceptionMiddleware>();

        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod().WithExposedHeaders("X-Pagination");
            });
        });

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
                ValidateIssuer = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = configuration["Jwt:Audience"],
                ValidateLifetime = true, // Check token expiration
                ClockSkew = TimeSpan.Zero // No tolerance for expiration time
            };

            // Customize the response for unauthorized requests
            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    // Log authentication failures
      
                    return Task.CompletedTask;
                },

                OnTokenValidated = context =>
                {
                    // Log successful token validation
                    var email = context.Principal?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        
                    return Task.CompletedTask;
                },

                OnChallenge = async context =>
                {
                    // Skip the default behavior
                    context.HandleResponse();

                    // Log the challenge (unauthorized request)
          

                    // Return a custom error message
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new
                    {
                        StatusCode = 401,
                        Message = "You are not authorized to access this resource."
                    }));
                }
            };
        });


        return services;
    }
}