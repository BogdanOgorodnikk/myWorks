import Vue from "vue";
import App from "./App.vue";
import "./assets/css/index.pcss";
import router from "./router";
import store from "./store";
import "./plugins/vuelidate";
import "./components/_bit";
import i18n from "./plugins/vue-i18n";
import ApiService from "./services/api.service";

Vue.config.productionTip = false;

ApiService.axiosInit();

window.instanciaVue = new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
