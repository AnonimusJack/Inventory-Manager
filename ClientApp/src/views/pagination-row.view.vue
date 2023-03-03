<template>
    <div id="inventory-manager__pagination-row-view__container">
        <div id="inventory-manager__pagination-row-view__pagination-container">
            <ThicArrowIcon
                v-if="ShouldLeftArrowBeVisible"
                class="left"
                @click="_ => onPageClick(-1)" 
            />
            <span>{{ CurrentPage }}</span>
            <ThicArrowIcon
                v-if="ShouldRightArrowBeVisible"
                @click="_ => onPageClick(1)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapMutations, mapState } from 'vuex';
    import ThicArrowIcon from '../components/resources/thic-arrow.icon.vue';

    export default defineComponent({
        name: 'ItemPage',
        components: {
            ThicArrowIcon
        },
        computed: {
            ShouldLeftArrowBeVisible() {
                return this.CurrentPage >= 1;
            },
            ShouldRightArrowBeVisible() {
                return (this.CurrentPage + 1) < this.MaxPages;
            },
            ...mapState(['MaxPages', 'CurrentPage'])
        },
        methods: {
            onPageClick(pageDirection: 1 | -1) {
                this.SelectPage(this.CurrentPage + pageDirection);
            },
            ClassForCurrentPage(page: number) {
                return `inventory-manager__pagination-row-view__page-container ${ ((page - 1) === this.CurrentPage) ? 'current' : '' }`;
            },
            ...mapMutations(['SelectPage'])
        }
    });
</script>

<style scoped lang="scss">
    #inventory-manager__pagination-row-view__container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        #inventory-manager__pagination-row-view__pagination-container {
            width: 20%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            gap: 1rem;

            svg {
                height: 2rem;
                width: 2rem;
                grid-column: 3;
                cursor: pointer;

                &.left {
                    grid-column: 1;
                    transform: rotate(180deg);
                }
            }

            span {
                height: 2rem;
                width: 2rem;
                grid-column: 2;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0.2rem;
                border-radius: 0.5rem;
                box-shadow: 1px 1px 3px gray;
            }
        }
    }
</style>