<template>
    <div class="inventory-manager__image-view__container">
        <img 
            :src="ImageUrl" 
            :alt="imageAlt"
            @mouseenter="onImageEnter"
            @mouseleave="onImageLeave"
        >
        <div 
            v-if="ShowActionButtons"
            class="inventory-manager__image-view__image-action-buttons-container"
        >
            <input
                class="hidden"
                type="file"
                ref="fileInput"
                @change="onAddedFileToInputHandler"
            >
            <button
                v-if="Boolean(imageUrl)"
                class="trash-button"
                @click="onRemoveButtonClick"
            >
                <TrashIcon />
            </button>
            <button
                class="edit-button"
                @click="onUploadButtonClikc"
            >
                <EditIcon />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { mapState } from 'vuex';
    import TrashIcon from '../components/resources/trash.icon.vue';
    import EditIcon from '../components/resources/edit.icon.vue';
    import { DEFAULT_ITEM_IMAGE_URL, RemoveImage, UploadImage } from '../services/inventory.service';

    export default defineComponent({
        name: 'ImageView',
        components: {
            EditIcon,
            TrashIcon
        },
        props: {
            imageUrl: {
                type: String,
                required: true
            },
            imageAlt: {
                type: String,
                required: true
            },
            imageUpdateCallback: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                showActionButtons: false
            };
        },
        computed: {
            ImageUrl() {
                return Boolean(this.imageUrl) ? this.imageUrl : DEFAULT_ITEM_IMAGE_URL;
            },
            ShowActionButtons() {
                if (this.ViewedOnMobile) {
                    return true;
                }
                return this.showActionButtons;
            },
            ...mapState(['ViewedOnMobile'])
        },
        methods: {
            async onAddedFileToInputHandler(event: any) {
                const target = event.target as HTMLInputElement;
                if (target.files && target.files.length > 0) {
                    try {
                        const uploadedImageUrl = await UploadImage(target.files[0]);
                        this.imageUpdateCallback(uploadedImageUrl);
                    } catch (error) {
                        console.error('Error uploading image:', error);
                    }
                } else {
                    console.warn('No file selected');
                }
            },
            async onRemoveButtonClick() {
                const removed = await RemoveImage(this.imageUrl);
                if (!removed) {
                    return;
                }
                this.imageUpdateCallback('');
            },
            onUploadButtonClikc() {
                (this.$refs.fileInput as HTMLInputElement).click();
            },
            onImageEnter() {
                this.showActionButtons = true;
            },
            onImageLeave() {
                this.showActionButtons = false;
            }
        }
    });
</script>

<style scoped lang="scss">
    .inventory-manager__image-view__container {
        height: 60%;
        width: 60%;
        position: relative;

        img {
            height: 100%;
            width: 100%;
            border-radius: 4rem;
        }

        .inventory-manager__image-view__image-action-buttons-container {
            position: absolute;
            right: 15%;
            bottom: 5%;
            display: flex;
            align-items: center;

            button {
                height: 1.2rem;
                width: 1.2rem;
                border: none;
                border-radius: 0.5rem;

                svg {
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }
</style>