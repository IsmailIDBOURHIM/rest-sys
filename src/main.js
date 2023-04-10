import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "normalize.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

createApp(App).use(store).use(router).use(VueSweetalert2).mount("#app");
