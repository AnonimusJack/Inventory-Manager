using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace KeterHomeAssignmentInventoryManagerApp.Models
{
    public class Item
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Index(IsUnique=true)]
        public string Barcode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        [DefaultValue(null)]
        public DateTime? AvailableFrom { get; set; }
        public float Price { get; set; }
        public float SalePrice { get; set; }
        public float Cost { get; set; }
    }
}