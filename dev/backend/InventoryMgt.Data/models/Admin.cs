using System;
using System.ComponentModel.DataAnnotations;

namespace InventoryMgt.Data.Models
{
    public class Admin : BaseSchema
    {
        [Key]
        public int IdAdmin { get; set; } // Primary key, auto-incremented

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } // Not null, max length 50

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } // Not null, max length 50

        [Required]
        [MaxLength(100)]
        [EmailAddress] // Ensures the email format is valid
        public string Email { get; set; } // Not null, unique, max length 100

        [Required]
        [MaxLength(100)]
        public string Password { get; set; } // Not null, max length 100

        [Required]
        [MaxLength(20)]
        public string NumTel { get; set; } // Not null, unique, max length 20

        [MaxLength(60)]
        public string? Address { get; set; } // Nullable, max length 60

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default value (GETDATE())

        public DateTime? UpdatedAt { get; set; } // Nullable
    }
}