import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'

import debounce from './directives/debounce'
import buried from './directives/buried'

import i18n from './lang'

const app = createApp(App);

app.directive('debounce',debounce);
app.directive('buried', buried);

app.use(ElementPlus).use(store).use(router).use(i18n).mount('#app')
