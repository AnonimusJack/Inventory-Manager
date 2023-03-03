import { createApp } from 'vue'
import App from './App.vue'
import { GeneralRouter } from './services/router.service';
import { GeneralStore } from './services/vuex.service'
import './main.scss';

createApp(App)
    .use(GeneralStore)
    .use(GeneralRouter)
    .mount('#app');
