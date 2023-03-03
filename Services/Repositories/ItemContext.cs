using KeterHomeAssignmentInventoryManagerApp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace KeterHomeAssignmentInventoryManagerApp.Services.Repositories
{
    public class ItemContext: DbContext
    {
        public DbSet<Item> Items { get; set; }

        public ItemContext(): base("DefaultConnection") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Item>()
                .Property(property => property.Name)
                .HasMaxLength(255);
            modelBuilder.Entity<Item>()
                .Property(property => property.Barcode)
                .HasMaxLength(255);
            modelBuilder.Entity<Item>()
                .Property(property => property.Description)
                .HasColumnType("text");
            modelBuilder.Entity<Item>()
                .Property(property => property.ImageUrl)
                .HasColumnType("text");
        }
    }
}