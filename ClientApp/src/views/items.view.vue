<template>
    <div id="invenoty-manager__items-view__container">
        <div id="invenoty-manager__items-view__header-container">
            <h1>Inventory Manager</h1>
            <div 
                id="invenoty-manager__items-view__header-searchbar-container"
                :class="SearchBarActiveClass"
            >
                <input 
                    v-if="ShowSearchInput"
                    type="text"
                    @input="onSearchInputChange"
                >
                <SearchIcon 
                    @click="onSearchIconClick"
                    :class="SearchBarActiveClass"
                />
            </div>
            <ItemsFilter />
            <button 
                class="add-button"
                @click="onAddButtonClick"
            >
                <PlusIcon />
            </button>
        </div>
        <div id="invenoty-manager__items-view__table-header-container">
            <span>Item Info</span>
            <span>Actions</span>
            <span>Barcode</span>
            <span>AvailableFrom</span>
        </div>
        <div id="invenoty-manager__items-view__table-container">
            <LoaderSpinner v-if="IsLoading" />
            <h4 v-if="!DisplayedItems.length && !IsLoading">No Items To Show</h4>
            <ItemRow v-for="item in DisplayedItems" :RowItem="item"/>
        </div>
        <PaginationRow />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapActions, mapMutations, mapState } from 'vuex';
    import ItemRow from '../components/item-row.component.vue';
    import PlusIcon from '../components/resources/plus.icon.vue';
    import SearchIcon from '../components/resources/search.icon.vue';
    import ItemsFilter from '../components/items-filter.component.vue';
    import PaginationRow from './pagination-row.view.vue';
    import LoaderSpinner from '../components/loader.component.vue';

    export default defineComponent({
        name: 'ItemsView',
        beforeMount() {
            this.GetInventoryItems();
        },
        components: {
            ItemRow,
            PlusIcon,
            SearchIcon,
            ItemsFilter,
            LoaderSpinner,
            PaginationRow,
        },
        data() {
            return {
                ShowSearchInput: false
            };
        },
        computed: {
            SearchBarActiveClass() {
                return this.ShowSearchInput ? 'active' : '';
            },
            ...mapState(['DisplayedItems', 'IsLoading'])
        },
        methods: {
            onAddButtonClick() {
                this.CreateNewItem();
            },
            onSearchIconClick() {
                this.ShowSearchInput = !this.ShowSearchInput;
            },
            onSearchInputChange(event: any) {
                this.SearchItems(event.target.value);
            },
            ...mapMutations(['SearchItems']),
            ...mapActions(['GetInventoryItems', 'CreateNewItem'])
        }
    });
</script>

<style scoped lang="scss">
    #invenoty-manager__items-view__container {
        height: 100%;
        width: 70%;
        padding: 1rem;
        box-sizing: border-box;
        background-color: white;
        border-radius: 1rem;
        border-top-right-radius: 0;
        box-shadow: 1px 1px 5px black;
        box-sizing: border-box;
        z-index: 1;

        #invenoty-manager__items-view__header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-right: 2rem;

            button {
                padding: 0.2rem;
                border: none;
                border-radius: 20%;
                cursor: pointer;

                svg {
                    height: 1.8rem;
                    width: 1.8rem;
                }
            }

            #invenoty-manager__items-view__header-searchbar-container {
                width: 22rem;
                min-width: 12rem;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 0.2rem;
                border-radius: 1rem;

                &.active {
                    box-shadow: 0px 5px 5px lightgray;
                }

                input {
                    height: 1.5rem;
                    width: 15rem;
                    border: none;
                    border-radius: 1rem;
                    outline: none;

                    &:active {
                        outline: none;
                    }
                }

                svg {
                    margin-right: 0.2rem;
                    padding-left: 0.2rem;
                    height: 1.5rem;
                    width: 1.5rem;
                    cursor: pointer;
                    
                    &.active {
                        border-left: 1px solid lightgray;
                    }
                }
            }

        }

        #invenoty-manager__items-view__table-header-container {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            justify-items: center;
            align-items: center;
            margin-bottom: 2rem;
            box-sizing: border-box;

            span {
                color: #777;
            }
        }

        #invenoty-manager__items-view__table-container {
            height: 65%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            overflow-y: auto;
            box-sizing: border-box;
        }

        @media screen and (max-width: 1055px) {
            width: 100%;
            display: flex;
            flex-direction: column;

            #invenoty-manager__items-view__header-container {
                flex-direction: column;
                align-items: center;

                #invenoty-manager__items-view__header-searchbar-container {
                    width: 100%;

                    input {
                        width: 5rem;
                    }
                }
            }

            #invenoty-manager__items-view__table-header-container {
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 1fr 1fr 1fr;
            }
        }
    }
</style>