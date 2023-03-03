<template>
    <div id="invenoty-manager__items-page__container">
        <ItemsView />
        <ItemView v-if="!ViewedOnMobile" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import ItemsView from '../views/items.view.vue';
    import ItemView from '../views/item.view.vue';
    import { mapState } from 'vuex';

    export default defineComponent({
        name: 'ItemsPage',
        components: {
            ItemsView, 
            ItemView
        },
        computed: {
            ...mapState(['ViewedOnMobile'])
        }
    });
</script>

<style scoped lang="scss">
    #invenoty-manager__items-page__container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        // grid-template-columns: 70% 30%;
        padding: 2rem;
        box-sizing: border-box;
        background: linear-gradient(320deg, blue 0%, darkblue 50%, navy 100%);

        @media screen and (max-width: 768px) {
            grid-template-columns: 100%;
        }
    }
</style>