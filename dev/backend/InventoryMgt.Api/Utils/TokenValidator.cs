using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using InventoryMgt.Data.Models;
using InventoryMgt.Data.Repositories;

namespace InventoryMgt.Api.Utils
{
    public class TokenValidator
    {
        private readonly IConfiguration _config;
        private readonly IAuthenticationRepository _authRepository;

        public TokenValidator(IConfiguration config, IAuthenticationRepository authRepository)
        {
            _config = config;
            _authRepository = authRepository;
        }

        public async Task<Admin?> ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

            try
            {
                // Validate the token
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _config["Jwt:Audience"],
                    ValidateLifetime = true, // Check token expiration
                    ClockSkew = TimeSpan.Zero // No tolerance for expiration time
                }, out var validatedToken);

                // Check if the token is a JWT token
                if (validatedToken is not JwtSecurityToken jwtToken)
                    return null;

                // Extract the email claim
                var emailClaim = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(emailClaim))
                    return null;

                // Check if the user exists in the database
                var admin = await _authRepository.GetAdminByEmail(emailClaim);
                return admin;
            }
            catch
            {
                // Token validation failed
                return null;
            }
        }
    }
}
