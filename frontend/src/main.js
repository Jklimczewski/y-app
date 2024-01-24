import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { CoUserFollow, CoUserUnfollow } from "oh-vue-icons/icons";

addIcons(CoUserFollow, CoUserUnfollow);

const pinia = createPinia();
const app = createApp(App);

app.component("v-icon", OhVueIcon);
app.use(pinia);
app.use(router);
app.mount("#app");
