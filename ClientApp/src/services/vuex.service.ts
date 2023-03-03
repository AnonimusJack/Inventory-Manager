import { createStore } from 'vuex';
import { Item } from '../models/item.model';
import { CheckIfOnMobileDevice } from '../utilities/browser.utilities';
import { Debounce } from '../utilities/function.utilities';
import { ItemSortingFunctionGenerator, SortDirection } from '../utilities/item.utilities';
import { CreateItem, DeleteItem, GetItems, UpdateItem } from './inventory.service';

export type GeneralStoreState = {
    ViewedOnMobile: boolean;
    ItemSource: Item[];
    QuerriedItems: Item[];
    DisplayedItems: Item[];
    SelectedItem?: Item;
    CurrentPage: number;
    MaxPages: number;
    IsLoading: boolean;
};

const DEFAULT_ITEMS_PER_PAGE = 8;

const ITEM_SORTING_FUNCTION_FACTORY = new ItemSortingFunctionGenerator();

const SET_DISPLAY_ITEMS = (state: GeneralStoreState) => {
    const paginationStartIndex = state.CurrentPage * DEFAULT_ITEMS_PER_PAGE;
    const paginationEndIndex = Math.min(paginationStartIndex + DEFAULT_ITEMS_PER_PAGE + 1, state.ItemSource.length);
    state.DisplayedItems = state.QuerriedItems.slice(paginationStartIndex, paginationEndIndex);
    // If the Page is empty, return a page
    if (state.DisplayedItems.length === 0 && state.CurrentPage > 0) {
        state.CurrentPage = state.CurrentPage - 1;
        SET_DISPLAY_ITEMS(state);
    }
};

const SEARCH_QUERY = Debounce((state: GeneralStoreState, searchQuery: string) => {
    state.QuerriedItems = state.ItemSource
                            .filter(item => item.Name.includes(searchQuery) || item.Barcode.includes(searchQuery));
    SET_DISPLAY_ITEMS(state);
}, 1500);


export const GeneralStore = createStore({
    state(): GeneralStoreState {
        return {
            ViewedOnMobile: CheckIfOnMobileDevice(),
            ItemSource: [],
            QuerriedItems: [],
            DisplayedItems: [],
            SelectedItem: undefined,
            CurrentPage: 0,
            MaxPages: 1,
            IsLoading: false
        }
    },
    mutations: {
        SetItemSource(state: GeneralStoreState, newSourceItemsState: Item[]) {
            state.ItemSource = newSourceItemsState;
            // Can't be 0 and it's better to have one more with less data
            state.MaxPages = Math.max(Math.ceil(newSourceItemsState.length / 8), 1)
            state.QuerriedItems = newSourceItemsState;
            SET_DISPLAY_ITEMS(state);
            if (newSourceItemsState.length) {
                state.SelectedItem = state.DisplayedItems[0];
            }
        },
        SearchItems(state: GeneralStoreState, searchQuery: string) {
            SEARCH_QUERY(state, searchQuery);
        },
        SortItems(state: GeneralStoreState, { itemKey, direction }: { itemKey: keyof Item, direction: SortDirection }) {
            state.QuerriedItems = [...state.QuerriedItems]
                .sort(ITEM_SORTING_FUNCTION_FACTORY.GetItemSortFunction(itemKey, direction));
            SET_DISPLAY_ITEMS(state);
        },
        SelectItem(state: GeneralStoreState, selectedItem: Item) {
            state.SelectedItem = selectedItem;
        },
        SelectPage(state: GeneralStoreState, selectedPage: number) {
            if (selectedPage < 0) {
                return;
            }
            state.CurrentPage = selectedPage;
            SET_DISPLAY_ITEMS(state);
        },
        SetLoadingStaet(state: GeneralStoreState, loadingState: boolean) {
            state.IsLoading = loadingState;
        } 
    },
    actions: {
        async GetInventoryItems({ commit }) {
            commit('SetLoadingStaet', true);
            const sourceItems = await GetItems();
            commit('SetLoadingStaet', false);
            commit('SetItemSource', sourceItems);
        },
        async CreateNewItem({ dispatch }) {
            const newItem = await CreateItem();
            if (!newItem) {
                return;
            }
            dispatch('AddItemToInventory', newItem);
        },
        async UpdateSelectedItem({ commit, state }) {
            if (!state.SelectedItem) {
                return false;
            }
            const itemUpdated = await UpdateItem(state.SelectedItem);
            if (!itemUpdated) {
                return false;
            }
            commit('SetItemSource', [...state.ItemSource]);
            commit('SelectItem', state.ItemSource[0]);
            return true;
        },
        async RemoveItem({ commit, state }, itemId: string) {
            const itemRemoved = await DeleteItem(itemId);
            if (!itemRemoved) {
                return;
            }
            const updatedSource = [...state.ItemSource].filter(item => item.Id !== itemId);
            commit('SetItemSource', updatedSource);
            if (state.SelectedItem?.Id === itemId) {
                commit('SelectItem', updatedSource[0]);
                return;
            }
            commit('SelectItem', undefined);
        },
        AddItemToInventory({ commit, state }, item: Item) {
            const updatedSource = [...state.ItemSource, item];
            commit('SetItemSource', updatedSource);
            commit('SelectItem', item);
        }
    }
});