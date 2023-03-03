<template>
    <ItemView/>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapActions, mapMutations, mapState } from 'vuex';
    import { Item } from '../models/item.model';
    import ItemView from '../views/item.view.vue';

    export default defineComponent({
        name: 'ItemPage',
        components: {
            ItemView
        },
        async beforeMount() {
            if (this.SelectedItem) {
                return;
            }
            const itemId = this.$route.params.id;
            if (!this.ItemSource.length) {
                await this.GetInventoryItems();
            }
            if (!this.ItemSource.length) {
                this.$router.push('/');
            }
            const itemForId = this.ItemSource.find((item: Item) => item.Id === itemId);
            if (!itemForId) {
                return;
            }
            this.SelectItem(itemForId);
        },
        computed: {
            ...mapState(['ItemSource', 'SelectedItem'])
        },
        methods: {
            ...mapMutations(['SelectItem']),
            ...mapActions(['GetInventoryItems'])
        }
    });
</script>

<style scoped lang="scss">
    
</style>