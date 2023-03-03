export class Item {
    constructor (
        public Id: string = '',
        public Barcode: string = '',
        public Name: string = 'New Item',
        public Description: string = '',
        public ImageUrl: string = '',
        public Price: number = 0,
        public SalePrice: number = 0,
        public Cost: number = 0,
        public AvailableFrom?: Date
    ) { }

    public static TransferData(fromItemData: Item, toItemData: Item) {
        for (const key of Object.keys(toItemData) as (keyof Item)[]) {
            (toItemData as any)[key] = fromItemData[key];
        }
    }

    public static ItemFromDTO(itemDTO: any) {
        const newItem = new Item();
        for (const key of Object.keys(newItem) as (keyof Item)[]) {
            (newItem[key] as any) = itemDTO[key];
        }
        if (newItem.AvailableFrom) {
            newItem.AvailableFrom = new Date(Date.parse(newItem.AvailableFrom as any));
        }
        return newItem;
    }
}