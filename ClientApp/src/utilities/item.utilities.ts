import { Item } from "../models/item.model";

export type SortDirection = 'asc' | 'desc';

export class ItemSortingFunctionGenerator {
    constructor() { }

    GetItemSortFunction = (propertyName: keyof Item, direction: SortDirection = 'asc') => {
        return this[`sortBy${ propertyName }`](direction);
    };

    // Sort by item ID
    private sortById(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => direction === 'asc' ? a.Id.localeCompare(b.Id) : b.Id.localeCompare(a.Id);
    }

    // Sort by item barcode
    private sortByBarcode(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => direction === 'asc' ? a.Barcode.localeCompare(b.Barcode) : b.Barcode.localeCompare(a.Barcode);
    }

    // Sort by item name
    private sortByName(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => direction === 'asc' ? a.Name.localeCompare(b.Name) : b.Name.localeCompare(a.Name);
    }

    // Sort by item description
    private sortByDescription(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => direction === 'asc'
                ? a.Description.localeCompare(b.Description)
                : b.Description.localeCompare(a.Description);
    }

    // Sort by item image URL
    private sortByImageUrl(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => direction === 'asc' ? a.ImageUrl.localeCompare(b.ImageUrl) : b.ImageUrl.localeCompare(a.ImageUrl);
    }

    // Sort by item availability date
    private sortByAvailableFrom(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => {
            if (!a.AvailableFrom && !b.AvailableFrom) {
                return 0;
            } else if (!a.AvailableFrom) {
                return direction === 'asc' ? 1 : -1;
            } else if (!b.AvailableFrom) {
                return direction === 'asc' ? -1 : 1;
            } else {
                return direction === 'asc' ? a.AvailableFrom.getTime() - b.AvailableFrom.getTime() : b.AvailableFrom.getTime() - a.AvailableFrom.getTime();
            }
        };
    }

    // Sort by item price
    private sortByPrice(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => direction === 'asc' ? a.Price - b.Price : b.Price - a.Price;
    }

    // Sort by item sale price
    private sortBySalePrice(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => direction === 'asc' ? a.SalePrice - b.SalePrice : b.SalePrice - a.SalePrice;
    }

    // Sort by item cost
    private sortByCost(direction: SortDirection = 'asc') {
        return (a: Item, b: Item) => direction === 'asc' ? a.Cost - b.Cost : b.Cost - a.Cost;
    }
}

export const CreateItemPropertySortingDirectionState = () => {
    const stateDictionary = new Map<string, SortDirection>();
    const itemKeys = Object.keys(new Item());
    for (const key of itemKeys) {
        stateDictionary.set(key, 'desc');
    }
    return Object.fromEntries(stateDictionary);
};

export const InverseSortDirection = (direction: SortDirection): SortDirection => {
    switch (direction) {
        case 'asc':
            return 'desc';
        case 'desc':
            return 'asc';
        default:
            throw new Error("Unknown Direction");
    }
};

export const ValidateItemBeforeUpdating = (item: Item) => {
    const idRegex = /^.{36}$/;
    const barcodeMaxLength = 255;

    // Validate Id
    if (!idRegex.test(item.Id)) {
        return false;
    }
    // Validate Barcode
    if (item.Barcode === null || item.Barcode === undefined || item.Barcode.length > barcodeMaxLength) {
        return false;
    }
    // Validate Name
    if (item.Name.length > 255) {
        return false;
    }
    // Validate Price, SalePrice and Cost
    if (item.Price < 0 || item.SalePrice < 0 || item.Cost < 0) {
        return false;
    }

    return true;
};