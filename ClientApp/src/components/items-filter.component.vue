<template>
    <div class="inverntory-manager__items-filter__container">
        <div class="inverntory-manager__items-filter__direction-container">
            <button
                @click="onSortDirectionClick"
            >
                <ArrowIcon :class="DirectionForProperty[SelectedOption]"/>
            </button>
        </div>
        <div :class="ClassForOpenSelect">
            <span
                @click="onPropertyOptionsSelectClick"
            >
                {{ SelectedOption }}
                <ArrowIcon class="desc"/>
            </span>
            <div 
                v-if="SelectIsOpen"
                class="inverntory-manager__items-filter__options-container"
            >
                <span 
                    v-for="option in FilterOptions"
                    @click="onOptionClick"
                >
                    {{ option }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { Item } from '../models/item.model';
    import { CreateItemPropertySortingDirectionState, InverseSortDirection } from '../utilities/item.utilities';
    import ArrowIcon from '../components/resources/arrow.icon.vue';
    import { mapMutations } from 'vuex';

    export default defineComponent({
        name: 'ItemsFilter',
        data() {
            return {
                SelectedOption: 'Name',
                SelectIsOpen: false,
                DirectionForProperty: CreateItemPropertySortingDirectionState()
            };
        },
        components: {
            ArrowIcon
        },
        computed: {
            FilterOptions() {
                return Object.keys(new Item());
            },
            ClassForOpenSelect() {
                return `inverntory-manager__items-filter__properties-container ${ this.SelectIsOpen ? 'open' : '' }`;
            }
        },
        methods: {
            sortItems() {
                const selectedKey = this.SelectedOption;
                this.SortItems({ itemKey: selectedKey, direction: this.DirectionForProperty[selectedKey] });
            },
            onSortDirectionClick() {
                const previousDirection = this.DirectionForProperty[this.SelectedOption];
                this.DirectionForProperty = { 
                    ...this.DirectionForProperty, 
                    [this.SelectedOption]: InverseSortDirection(previousDirection) 
                };
                this.sortItems();
            },
            onPropertyOptionsSelectClick() {
                this.SelectIsOpen = !this.SelectIsOpen;
            },
            onOptionClick(event: any) {
                this.SelectedOption = event.target.innerText;
                this.SelectIsOpen = false;
                this.sortItems();
            },
            ...mapMutations(['SortItems'])
        }
    });
</script>

<style scoped lang="scss">
    .inverntory-manager__items-filter__container {
        width: 10rem;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        padding: 0.4rem;
        
        .inverntory-manager__items-filter__direction-container {
            height: 1.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.4rem;
            padding-left: 0;
            border: 1px solid gray;
            border-left: none;
            border-top-right-radius: 1rem;
            border-bottom-right-radius: 1rem;

            button {
                height: 1.5rem;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                border: none;
                border-left: 1px solid gray;
                background-color: transparent;
                cursor: pointer;

                svg {
                    height: 100%;
                    width: 100%;

                    &.desc {
                        transform: rotate(180deg);
                    }
                }
            }
        }
        .inverntory-manager__items-filter__properties-container {
            height: 1.2rem;
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;
            padding: 0.4rem;
            border-top-left-radius: 1rem;
            border-bottom-left-radius: 1rem;
            cursor: pointer;
            border: 1px solid gray;
            border-right: none;

            &.open {
                border-left: 1px solid gray;
                border-top: 1px solid gray;
                border-bottom-left-radius: 0;
            }

            span {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.8rem;

                svg {
                    height: 1rem;
                    width: 1rem;

                    &.desc {
                        transform: rotate(180deg);
                    }
                }
            }

            .inverntory-manager__items-filter__options-container {
                width: 87%;
                position: absolute;
                top: 2rem;
                left: -1px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 0.5rem;
                background-color: white;
                border: 1px solid gray;
                border-bottom-left-radius: 1rem;
                border-bottom-right-radius: 1rem;
                z-index: 1;

                span {
                    width: 100%;
                    padding: 0.2rem 0;
                    cursor: pointer;

                    &:hover {
                        background-color: lightgray;
                    }
                }
            }
        }
    }
</style>