using Microsoft.Extensions.Logging;

namespace InventoryMgt.Api.Utils
{
    public static class LoggerUtility
    {
        private static ILogger _logger;

        // Initialize the logger
        public static void Initialize(ILogger logger)
        {
            _logger = logger;
        }

        // Log information messages with structured data
        public static void LogInformation(string message, params object[] args)
        {
            _logger?.LogInformation(message, args);
        }

        // Log warning messages with structured data
        public static void LogWarning(string message, params object[] args)
        {
            _logger?.LogWarning(message, args);
        }

        // Log error messages with structured data
        public static void LogError(string message, params object[] args)
        {
            _logger?.LogError(message, args);
        }

        // Log exception messages with structured data
        public static void LogError(Exception ex, string message, params object[] args)
        {
            _logger?.LogError(ex, message, args);
        }
    }
}