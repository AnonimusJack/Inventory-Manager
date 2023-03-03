import { 
    createRouter, 
    RouteLocationNormalized, 
    createWebHistory
} from 'vue-router';
import ItemsPage from '../pages/items.page.vue';
import ItemPage from '../pages/item.page.vue';
import { GeneralStore } from './vuex.service';


const mobileOnlyGuard = (
    to: RouteLocationNormalized
) => {
    if (!GeneralStore.state.ViewedOnMobile) {
        return {
            path: '/'
        }
    }
}

const routes = [
    { path: '/', component: ItemsPage },
    { 
        path: '/items/:id', 
        component: ItemPage,
        beforeEnter: mobileOnlyGuard
    }
];

export const GeneralRouter = createRouter({
    history: createWebHistory(),
    routes
});