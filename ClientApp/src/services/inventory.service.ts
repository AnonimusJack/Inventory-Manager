import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Item } from '../models/item.model';

const inventoryApi = axios.create({
    baseURL: `${ import.meta.env.VITE_SERVICE_URL }/api/Inventory`
});

axiosRetry(inventoryApi, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

export const DEFAULT_ITEM_IMAGE_URL = `${ import.meta.env.VITE_SERVICE_URL }/images/default_item.png`;

export const GetItems = async () => {
    try {
        const itemDTOs = (await inventoryApi.get('')).data as Item[];
        const itemObjects = itemDTOs.map(itemDTO => Item.ItemFromDTO(itemDTO));
        return itemObjects;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const CreateItem = async () => {
    try {
        const createdItem = (await inventoryApi.post('')).data as Item;
        const createdItemObject = Item.ItemFromDTO(createdItem);
        return createdItemObject;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const UpdateItem = async (itemUpdatedData: Item) => {
    try {
        const updated = (await inventoryApi.patch(`/${ itemUpdatedData.Id }`, itemUpdatedData)).data;
        return updated;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const DeleteItem = async (itemId: string) => {
    try {
        const deleted = (await inventoryApi.delete(`/${ itemId }`)).data;
        return deleted;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const UploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
        const fileUrlInsideTheServer = (await inventoryApi.post<string>(
            '/images',
            formData,
            {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            }
        )).data;

        return `${ import.meta.env.VITE_SERVICE_URL }${ fileUrlInsideTheServer }`;
    } catch (error) {
        console.error('Error uploading image: ', error);
        throw error;
    }
  };

  export const RemoveImage = async (imageUrl: string) => {
    try {
        const imageFilename = imageUrl.split('/').pop();
        const removed = await inventoryApi.delete(`/images?imageName=${ imageFilename }`);
        return removed;
    } catch (error) {
        console.error(error);
        return false;
    }
  };