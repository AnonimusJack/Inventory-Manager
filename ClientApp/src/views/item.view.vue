<template>
    <div v-if="LocalItem" id="invenoty-manager__item-view__container">
        <button 
            v-if="ViewedOnMobile"
            id="invenoty-manager__item-view__return-button"
            @click="onReturnToMainButtonClick"
        >
            <ArrowIcon />
        </button>
        <div id="invenoty-manager__item-view-main-data__container">
            <ImageView
                :image-url="LocalItem!.ImageUrl"
                :image-alt="LocalItem!.Barcode"
                :image-update-callback="UpdateImageUrl" 
            />
            <div id="invenoty-manager__item-view-identifying-inputs__container">
                <input 
                    class="h3"
                    :readonly="!EditMode" 
                    type="text" 
                    v-model="LocalItem!.Name" 
                    placeholder="Name"
                >
                <input 
                    :readonly="!EditMode" 
                    type="text" 
                    v-model="LocalItem!.Barcode" 
                    placeholder="Barcode"
                >
            </div>
            <div id="invenoty-manager__item-view-action-buttons__container">
                <button
                    v-if="!EditMode"
                    class="edit-button"
                    @click="onEditButtonClick"
                >
                    <EditIcon />
                </button>
                <button
                    v-if="EditMode"
                    class="save-button"
                    @click="onSaveButtonClick"
                >
                    <SaveIcon />
                </button>
                <button
                    v-if="EditMode"
                    class="trash-button"
                    @click="onReturnButtonClick"
                >
                    <ReturnIcon />
                </button>
                <button 
                    class="trash-button"
                    @click="onDeleteButtonClick"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
        <div id="invenoty-manager__item-view-secondary-data__container">
            <LabeledInput 
                :bound-value="LocalItem!.Price"
                :edit-mode="EditMode"
                input-type="tel"
                label="Price"
                suffix="Dollars"
                :on-input-callback="onLabeledInputChange('Price')"
            />
            <LabeledInput 
                :bound-value="LocalItem!.SalePrice"
                :edit-mode="EditMode"
                input-type="tel"
                label="SalePrice"
                suffix="Dollars"
                :on-input-callback="onLabeledInputChange('SalePrice')"
            />
            <LabeledInput 
                :bound-value="LocalItem!.Cost"
                :edit-mode="EditMode"
                input-type="tel"
                label="Cost"
                suffix="Dollars"
                :on-input-callback="onLabeledInputChange('Cost')"
            />
            <LabeledInput 
                :bound-value="AvailableFromDateString"
                :edit-mode="EditMode"
                input-type="date"
                label="AvailableFrom"
                :on-input-callback="onLabeledInputChange('AvailableFrom')"
            />
        </div>
    </div>
    <div 
        v-if="!LocalItem" 
        id="invenoty-manager__item-view__container" 
        class="placeholder"
    >
        <div id="invenoty-manager__item-view-main-data__container">
            <LoaderSpinner v-if="IsLoading"/>
        </div>
        <div id="invenoty-manager__item-view-secondary-data__container"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapActions, mapState } from 'vuex';
    import { ValidateItemBeforeUpdating } from '../utilities/item.utilities';
    import TrashIcon from '../components/resources/trash.icon.vue';
    import EditIcon from '../components/resources/edit.icon.vue';
    import SaveIcon from '../components/resources/save.icon.vue';
    import ReturnIcon from '../components/resources/return.icon.vue';
    import ArrowIcon from '../components/resources/arrow.icon.vue';
    import LabeledInput from '../components/labeled-input.component.vue';
    import LoaderSpinner from '../components/loader.component.vue';
    import ImageView from './image.view.vue';
    import { Item } from '../models/item.model';

    export default defineComponent({
        name: 'ItemView',
        components: {
            TrashIcon,
            EditIcon,
            SaveIcon,
            ArrowIcon,
            ImageView,
            ReturnIcon,
            LabeledInput,
            LoaderSpinner,
        },
        mounted() {
            this.LocalItem = this.SelectedItem;
        },
        data() {
            return {
                EditMode: false,
                LocalItem: undefined
            } as { EditMode: boolean, LocalItem?: Item };
        },
        computed: {
            AvailableFromDateString() {
                if (!this.LocalItem?.AvailableFrom) {
                    return '';
                }
                
                return this.LocalItem.AvailableFrom.toISOString().substring(0,10);
            },
            ...mapState(['SelectedItem', 'IsLoading', 'ViewedOnMobile'])
        },
        methods: {
            UpdateImageUrl(newUrl: string) {
                if (!this.LocalItem) {
                    return;
                }
                this.LocalItem.ImageUrl = newUrl;
                this.onSaveButtonClick();
            },
            onReturnToMainButtonClick() {
                this.$router.push('/');
            },
            onReturnButtonClick() {
                this.EditMode = false;
                this.LocalItem = Item.ItemFromDTO({ ...this.SelectedItem });
            },
            onEditButtonClick() {
                this.EditMode = true;
            },
            async onSaveButtonClick() {
                if (!this.LocalItem) {
                    return;
                }
                const itemIsValidForUpdate = ValidateItemBeforeUpdating(this.LocalItem);
                if (!itemIsValidForUpdate) {
                    return;
                }
                Item.TransferData(this.LocalItem, this.SelectedItem);
                const updated = await this.UpdateSelectedItem();
                if (!updated) {
                    return;
                }
                this.EditMode = false;
            },
            onDeleteButtonClick() {
                if (!this.LocalItem) {
                    return;
                }
                this.RemoveItem(this.LocalItem.Id);
                if (this.ViewedOnMobile) {
                    this.$router.push('/');
                }
            },
            onLabeledInputChange(propertyName: string) {
                return (value: any) => {
                    if (!this.LocalItem) {
                        return;
                    }
                    if (propertyName === 'AvailableFrom') {
                        (this.LocalItem as any)[propertyName] = new Date(Date.parse(value));    
                        return;
                    }
                    (this.LocalItem as any)[propertyName] = value;
                };
            },
            ...mapActions(['UpdateSelectedItem', 'RemoveItem'])
        },
        watch: {
            SelectedItem: function(newValue?: Item) {
                if (!newValue) {
                    this.LocalItem = undefined;
                    return;
                }
                this.LocalItem = Item.ItemFromDTO({ ...newValue });
            }
        }
    });
</script>

<style scoped lang="scss">
    #invenoty-manager__item-view__container.placeholder {
        height: 60vh;
        max-height: 60vh;
        min-width: 5%;
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        #invenoty-manager__item-view-main-data__container {
            height: 50%;
            border-top-right-radius: 1rem;
        }
    }

    #invenoty-manager__item-view__container {
        height: fit-content;
        max-height: 90vh;
        width: 30%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 4rem;
        background-color: rgb(59, 81, 221);
        box-sizing: border-box;

        input {
            background-color: transparent;
            border: none;
            border-bottom: 1px solid #999;
            text-overflow: ellipsis;

            &:read-only {
                border-bottom: none;
                pointer-events: none;
            }
        }

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

        #invenoty-manager__item-view__return-button {
            position: absolute;
            top: 2%;
            left: 2%;

            svg {
                transform: rotate(-90deg);
            }
        }

        #invenoty-manager__item-view-main-data__container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            padding: 1rem;
            background: linear-gradient(152deg, rgba(174,173,175,1) 0%, rgb(109, 109, 109) 70%);
            border-bottom-right-radius: 5rem;

            #invenoty-manager__item-view-identifying-inputs__container {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                .h3 {
                    font-size: 1.5rem;
                    font-weight: 800;
                }
            }

            #invenoty-manager__item-view-action-buttons__container {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 0.5rem;
            }
        }

        #invenoty-manager__item-view-secondary-data__container {
            width: 100%;
            height: fit-content;
            min-height: 10rem;
            max-height: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
            padding: 1rem;
            margin-bottom: 1rem;
            overflow-x: hidden;
            overflow-y: auto;
            border-bottom-left-radius: 4rem;
            border-bottom-right-radius: 4rem;
            box-sizing: border-box;
        }

        @media screen and (max-width: 1055px) {
            width: 100%;
        }
    }
</style>