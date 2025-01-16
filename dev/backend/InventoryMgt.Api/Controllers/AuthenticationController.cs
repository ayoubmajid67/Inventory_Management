using InventoryMgt.Api.CustomExceptions;
using InventoryMgt.Api.Utils;
using InventoryMgt.Data.models.DTOs;
using InventoryMgt.Data.Models;
using InventoryMgt.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InventoryMgt.Api.Controllers;

[ApiController]
[Route("/api/Auth")]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationRepository _authenticationRepository;
    private readonly IConfiguration _config;

    public AuthenticationController(
        IAuthenticationRepository authenticationRepository,
        IConfiguration config) // Inject ILogger
    {
        _authenticationRepository = authenticationRepository;
        _config = config;
     
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
      

        // Check if the model is valid
        if (!ModelState.IsValid)
        {
          
            return BadRequest(ModelState);
        }

        // Proceed with login logic
        var admin = await _authenticationRepository.Login(loginRequest.Email, loginRequest.Password);

        if (admin == null)
        {

            return Unauthorized("Invalid email or password.");
        }

        // Generate JWT token
        var token = GenerateJwtToken(admin);

       
        return Ok(new { Token = token,
            Admin = new
            {
                admin.Id,
                admin.Email,
                admin.FirstName,
                admin.LastName,
          
             
            }
        });
    }

    private string GenerateJwtToken(Admin admin)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, admin.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, admin.IdAdmin.ToString()),
            new Claim(ClaimTypes.Email, admin.Email),
            new Claim(ClaimTypes.Role, "Admin") // Add roles if needed
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(2), // Token expires in 2 days
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}