import {createApp} from 'vue';
import App from './components/App.vue';
import {setupExtensionSync} from './composables/useGlobalTimer';
const app = createApp(App);
app.mount('#app');

setupExtensionSync();
