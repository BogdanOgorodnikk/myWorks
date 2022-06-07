import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import ApiServiceDefault from "@ilevel/our.service.api";
import NotifyServiceDefault from "@ilevel/our.service.notify";
import store from "@/store";
import router from "@/router";

class ApiService extends ApiServiceDefault {
  #notify = new NotifyServiceDefault();

  /**
   * Set axios interceptors
   * @param { Object } $axios
   */
  setAxiosInterceptors($axios) {
    $axios.interceptors.response.use(
      (response) => {
        this.loader("off", response.config.url);

        const { headers } = response;

        if (headers) {
          const token = headers["refresh-token"];
          const expires = headers["refresh-expires"];

          if (token) {
            store.commit("SET_AUTH", { token, expires });
          }
        }

        return response;
      },
      (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const routeName = router.history.current.name;
        const isLoginPage = routeName === "Login";

        this.loader("off", error.config.url);

        if (status === 401 && !isLoginPage) {
          store.dispatch("clearAuth");
        } else if (Array.isArray(message) && message.length) {
          message.forEach((code) => this.#notify.error(code));
        } else {
          this.#notify.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Change loaders state (on | off)
   * @param { String } state
   * @param { String } resource
   */
  loader(state, resource) {
    if (state === "on") store.commit("loader/SET_LOADING_ON", resource);
    if (state === "off") store.commit("loader/SET_LOADING_OFF", resource);
  }

  axiosInit() {
    const restApiPrefix = process.env.VUE_APP_REST_API_PREFIX;

    Vue.use(VueAxios, axios);

    Vue.axios.defaults.baseURL = restApiPrefix;

    this.setAxiosInterceptors(Vue.axios);
  }
}

export default new ApiService();
