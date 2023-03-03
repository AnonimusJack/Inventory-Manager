using KeterHomeAssignmentInventoryManagerApp.Models;
using KeterHomeAssignmentInventoryManagerApp.Services.Repositories;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace KeterHomeAssignmentInventoryManagerApp.Controllers
{
    public class InventoryController : ApiController
    {
        private readonly ItemContext itemContext = new ItemContext();


        // GET: api/Inventory
        public IEnumerable<Item> Get()
        {
            Item[] allItems = itemContext.Database.SqlQuery<Item>(@"EXEC dbo.spGetItems").ToArray();
            return allItems;
        }

        // GET: api/Inventory/5
        public Item Get(string id)
        {
            Item querriedItem = itemContext.Database.SqlQuery<Item>(
                @"EXEC dbo.spGetItemById @ItemId",
                new SqlParameter("ItemId", Guid.Parse(id))
            ).FirstOrDefault();
            return querriedItem;
        }

        // POST: api/Inventory
        public Item Post()
        {
            string defaultBarcode = $"New-Item-{ Guid.NewGuid() }";
            Item newItem = itemContext.Database.SqlQuery<Item>(
                @"EXEC dbo.spCreateItem @Barcode",
                new SqlParameter("@Barcode", defaultBarcode)
            ).FirstOrDefault();
            return newItem;
        }

        // POST: api/Inventory/images
        [HttpPost]
        [Route("api/Inventory/images")]
        public IHttpActionResult UploadImage()
        {
            HttpRequest httpRequest = HttpContext.Current.Request;
            // Check if file is present
            if (httpRequest.Files.Count == 0)
            {
                return BadRequest("No files uploaded.");
            }
            HttpPostedFile uploadedImage = httpRequest.Files[0];
            string fileExtension = Path.GetExtension(uploadedImage.FileName);
            string fileName = Guid.NewGuid().ToString() + fileExtension;
            string destinationPath = HttpContext.Current.Server.MapPath("~/wwwroot/uploaded_images/" + fileName);
            uploadedImage.SaveAs(destinationPath);

            string outsidePathToFile = Path.Combine("/images/", fileName);
            return Ok(outsidePathToFile);
        }

        // DELETE: api/Inventory/images?imageName
        [HttpDelete]
        [Route("api/Inventory/images")]
        public IHttpActionResult DeleteImage(string imageName)
        {
            string imagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/wwwroot/uploaded_images"), imageName);
            if (!File.Exists(imagePath))
            {
                return NotFound();
            }
            File.Delete(imagePath);
            return Ok(true);
        }


        // PATCH: api/Inventory/5
        // Create a Generic SP to update Partial Data From a Dictionary of key-values (i.e JSON) for slimer updates
        public bool Patch(string id, [FromBody]Item updateData)
        {
            bool itemUpdated = Convert.ToBoolean(itemContext.Database.SqlQuery<int>(
                @"EXEC dbo.spUpdateItem @Id, @Barcode, @Name, @Description, @ImageUrl, @AvailableFrom, @Price, @SalePrice, @Cost, @ReturnItem",
                new SqlParameter("@Id", Guid.Parse(id)),
                new SqlParameter("@Barcode", updateData.Barcode),
                new SqlParameter("@Name", updateData.Name),
                new SqlParameter("@Description", updateData.Description),
                new SqlParameter("@ImageUrl", updateData.ImageUrl),
                new SqlParameter("@AvailableFrom", (object)updateData.AvailableFrom ?? DBNull.Value),
                new SqlParameter("@Price", updateData.Price),
                new SqlParameter("@SalePrice", updateData.SalePrice),
                new SqlParameter("@Cost", updateData.Cost),
                new SqlParameter("@ReturnItem", false)
            ).FirstOrDefault());
            return itemUpdated;
        }

        // DELETE: api/Inventory/5
        public bool Delete(string id)
        {
            bool deleted = Convert.ToBoolean(itemContext.Database.SqlQuery<int>(
                @"EXEC dbo.spDeleteItem @ItemId, @ReturnItem",
                new SqlParameter("@ItemId", Guid.Parse(id)),
                new SqlParameter("@ReturnItem", false)
            ).FirstOrDefault());
            return deleted;
        }
    }
}
