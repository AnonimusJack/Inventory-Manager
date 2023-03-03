using KeterHomeAssignmentInventoryManagerApp.Services.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace KeterHomeAssignmentInventoryManagerApp.DatabaseUtilities
{
    public class ItemsInitializer: DropCreateDatabaseIfModelChanges<ItemContext>
    {
        protected override void Seed(ItemContext context)
        {
            // Get Many with Pagination
            context.Database.ExecuteSqlCommand(@"
                CREATE PROCEDURE spGetItemsPage
                    @PageSize INT,
                    @PageNumber INT
                AS
                BEGIN
                    SELECT *
                    FROM (
                        SELECT *,
                            ROW_NUMBER() OVER (ORDER BY Id) AS RowNum
                        FROM Items
                    ) AS ItemsWithRowNum
                    WHERE RowNum >= (@PageNumber - 1) * @PageSize + 1
                        AND RowNum <= @PageNumber * @PageSize
                END
            ");

            // Get All
            context.Database.ExecuteSqlCommand(@"
                CREATE PROCEDURE spGetItems
                AS
                BEGIN
                    SELECT * FROM Items;
                END
            ");
                // Create CRUD Procedures
            // Create
            #region Create
            context.Database.ExecuteSqlCommand(@"
                CREATE PROCEDURE spCreateItem
                    @Barcode NVARCHAR(255)
                AS
                BEGIN
                    DECLARE @NewItem TABLE (
                        Id UNIQUEIDENTIFIER, 
                        Barcode NVARCHAR(255),
                        Name NVARCHAR(255),
                        Description TEXT, 
                        ImageUrl TEXT, 
                        AvailableFrom DATETIME, 
                        Price REAL, 
                        SalePrice REAL, 
                        Cost REAL
                    );
        
                    INSERT INTO Items(Barcode, Name, Description, ImageUrl, Price, SalePrice, Cost)
                    OUTPUT INSERTED.* INTO @NewItem
                    VALUES ( @Barcode, 'New Item', '', '', 0.0, 0.0, 0.0);
        
                    SELECT * FROM @NewItem;
                END
            ");
            #endregion

            // Read
            #region Read
            context.Database.ExecuteSqlCommand(@"
                CREATE PROCEDURE spGetItemById
                    @ItemId UNIQUEIDENTIFIER
                AS
                BEGIN
                    SELECT * FROM Items WHERE Id = @ItemId;
                END
            ");
            #endregion
            // Update
            #region Update
            context.Database.ExecuteSqlCommand(@"
                CREATE PROCEDURE spUpdateItem
                    @Id UNIQUEIDENTIFIER,
                    @Barcode NVARCHAR(255),
                    @Name NVARCHAR(255),
                    @Description TEXT,
                    @ImageUrl TEXT,
                    @AvailableFrom DATETIME = NULL,
                    @Price REAL,
                    @SalePrice REAL,
                    @Cost REAL,
                    @ReturnItem BIT = 1
                AS
                BEGIN
                    UPDATE Items
                    SET Barcode = @Barcode,
                        Name = @Name,
                        Description = @Description,
                        ImageUrl = @ImageUrl,
                        AvailableFrom = @AvailableFrom,
                        Price = @Price,
                        SalePrice = @SalePrice,
                        Cost = @Cost
                    WHERE Id = @Id;
                    IF @@ROWCOUNT = 0
                    BEGIN
                        SELECT 0 AS 'Updated';
                        RETURN;
                    END
                    IF @ReturnItem = 1
                    BEGIN
                        SELECT * FROM Items WHERE Id = @Id;
                    END
                    ELSE
                    BEGIN
                        SELECT 1 AS 'Updated';
                    END
                END
            ");
            #endregion
            // Delete
            #region Delete
            context.Database.ExecuteSqlCommand(@"
                CREATE PROCEDURE spDeleteItem
                    @ItemId UNIQUEIDENTIFIER,
                    @ReturnItem BIT = 1
                AS
                BEGIN
                    DECLARE @DeletedItem TABLE (
                        Id UNIQUEIDENTIFIER,
                        Barcode NVARCHAR(255),
                        Name NVARCHAR(255), 
                        Description TEXT, 
                        ImageUrl TEXT, 
                        AvailableFrom DATETIME, 
                        Price REAL, 
                        SalePrice REAL, 
                        Cost REAL
                    );

                    IF EXISTS (SELECT Id FROM Items WHERE Id = @ItemId)
                    BEGIN
                        DELETE FROM Items OUTPUT DELETED.* INTO @DeletedItem WHERE Id = @ItemId;
                        IF @ReturnItem = 1
                        BEGIN
                            SELECT * FROM @DeletedItem;
                        END
                        ELSE
                        BEGIN
                            SELECT 1 AS 'Deleted';
                        END
                    END
                    ELSE
                    BEGIN
                        SELECT 0 AS 'Deleted';
                    END
                END
            ");
            #endregion
        }
    }
}