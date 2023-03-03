<template>
    <div class="invenoty-manager__item-row__container">
        <div class="invenoty-manager__item-row-item-info__container">
            <div class="invenoty-manager__item-row-visuals__container">
                <img :src="ImageUrl" :alt="RowItem.Barcode">
                <div :class="ItemAvailabilityClass"></div>
            </div>
            <div class="invenoty-manager__item-row-mvp-data__container">
                <h3 @click="onItemNameClick">{{ RowItem.Name }}</h3>
                <div class="invenoty-manager__item-row-monetary-data__container">
                    <h3>Sale Price:</h3>
                    <span>{{ RowItem.SalePrice }}$</span>
                    <h3>Cost:</h3>
                    <span>{{ RowItem.Cost }}$</span>
                </div>
            </div>
        </div>
        <button 
            class="trash-button"
            @click="onDeleteButtonClick"
        >
            <TrashIcon />
        </button>
        <span>{{ RowItem.Barcode }}</span>
        <span>{{ AvailableFromParsedDate }}</span>

    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapActions, mapMutations, mapState } from 'vuex';
    import { Item } from '../models/item.model';
    import { DEFAULT_ITEM_IMAGE_URL } from '../services/inventory.service';
    import TrashIcon from './resources/trash.icon.vue';

    export type ItemRowProperties = {
        Item: Item;
    };

    export default defineComponent({
        name: 'ItemRow',
        props: {
            RowItem: {
                type: Item,
                required: true
            }
        },
        components: {
            TrashIcon
        },
        computed: {
            ItemAvailableForSale() {
                return Boolean(this.RowItem?.AvailableFrom);
            },
            ItemAvailabilityClass() {
                return this.ItemAvailableForSale ? 'available' : 'unavailable';
            },
            ImageUrl() {
                return Boolean(this.RowItem.ImageUrl) ? this.RowItem.ImageUrl : DEFAULT_ITEM_IMAGE_URL;
            },
            AvailableFromParsedDate() {
                return this.RowItem.AvailableFrom?.toLocaleDateString('he-IL') ?? 'UnAvailable';
            },
            ...mapState(['ViewedOnMobile'])
        },
        methods: {
            onItemNameClick() {
                this.SelectItem(this.RowItem);
                if (this.ViewedOnMobile) {
                    this.$router.push(`/items/${ this.RowItem.Id }`);
                }
            },
            onDeleteButtonClick() {
                this.RemoveItem(this.RowItem.Id);
            },
            ...mapMutations(['SelectItem']),
            ...mapActions(['RemoveItem'])
        }
    });
</script>

<style scoped lang="scss">
    .invenoty-manager__item-row__container {
        width: 100%;
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        align-items: center;
        justify-items: center;
        padding: 2rem 0;
        
        &:not(:last-of-type)::after {
            content: "";
            width: 93%;
            position: absolute;
            bottom: 0;
            justify-self: center;
            border: 1px #aaaaaa28 solid;
            border-radius: 1rem;
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.2rem;
            border: none;
            border-radius: 50%;
            cursor: pointer;

            svg {
                height: 1rem;
                width: 1rem;
            }
        }

        span {
            color: #777;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: default;
        }

        .invenoty-manager__item-row-item-info__container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;

            .invenoty-manager__item-row-visuals__container {
                height: 4rem;
                width: 4rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
    
                img {
                    height: 3rem;
                    width: 3rem;
                    border-radius: 30%;
                    box-shadow: 0 0 10px rgb(54, 54, 54);
                }
    
                div {
                    height: 0.5rem;
                    width: 0.5rem;
                    position: absolute;
                    top: 0.1rem;
                    left: 0.1rem;
                    border: 1px white solid;
                    outline: 1px white solid;
                    border-radius: 50%;
    
                    &.available {
                        background-color: limegreen;
                        outline-color: limegreen;
                    }
    
                    &.unavailable {
                        background-color: crimson;
                        outline-color: crimson;
                    }
                }
            }

            .invenoty-manager__item-row-mvp-data__container {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;

                h3 {
                    margin: 0;
                    font-size: 1rem;
                    cursor: pointer;
                }

                .invenoty-manager__item-row-monetary-data__container {
                    display: flex;
                    align-items: baseline;
                    gap: 0.5rem;

                    h3 {
                        margin: 0;
                        font-size: 0.8rem;
                        cursor: default;
                    }

                    span {
                        color: black;
                        font-size: 0.7rem;
                        cursor: default;
                    }
                }
            }
        }

        @media screen and (max-width: 1055px) {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr 1fr 1fr;
        }
    }
</style>