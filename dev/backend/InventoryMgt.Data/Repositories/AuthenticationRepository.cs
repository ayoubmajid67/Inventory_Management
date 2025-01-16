using System.Data;
using Dapper;
using InventoryMgt.Data.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace InventoryMgt.Data.Repositories
{
    public interface IAuthenticationRepository
    {
        Task<Admin?> Login(string email, string password);
        Task<Admin?> GetAdminByEmail(string email);
    }

    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly string? _connectionString;
        private readonly IConfiguration _config;

        public AuthenticationRepository(IConfiguration config)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("default");
        }

        public async Task<Admin?> Login(string email, string password)
        {
            using IDbConnection connection = new SqlConnection(_connectionString);

            // Query the database to find an admin with the provided email and password
            var admin = await connection.QueryFirstOrDefaultAsync<Admin>(
                "usp_LoginAdmin",
                new { Email = email, Password = password },
                commandType: CommandType.StoredProcedure
            );

            return admin;
        }
        public async Task<Admin?> GetAdminByEmail(string email)
        {
            using IDbConnection connection = new SqlConnection(_connectionString);

            // Query the database to find an admin by email
            var admin = await connection.QueryFirstOrDefaultAsync<Admin>(
                "SELECT * FROM Admin WHERE Email = @Email",
                new { Email = email }
            );

            return admin;
        }
    }
}