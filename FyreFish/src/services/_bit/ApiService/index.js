import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtServiceDefault from "@ilevel/our.service.jwt";
import NotifyServiceDefault from "@ilevel/our.service.notify";
import i18nServiceDefault from "@ilevel/our.service.i18n";

export default class ApiServiceDefault {
  #notify = new NotifyServiceDefault();

  /**
   * Set axios interceptors
   * @param { Object } $axios
   */
  setAxiosInterceptors($axios) {
    $axios.interceptors.response.use(
      (response) => {
        this.loader("off", response.config.url);

        return response;
      },
      (error) => {
        const message = this.getResponseMessage(error.response);

        this.loader("off", error.config.url);

        if (Array.isArray(message) && message.length) {
          message.forEach((code) => this.#notify.error(code));
        } else {
          this.#notify.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    const authToken = new JwtServiceDefault().getAuthToken();

    Vue.axios.defaults.headers.common = {
      Authorization: `Bearer ${authToken}`,
      Language: i18nServiceDefault.getActiveLanguage(),
    };
  }

  /**
   * Get axios request config (method for redeclaration)
   * @param { Object } settings
   * @returns { Object }
   */
  getRequestConfig(settings) {
    if (settings) {
      return {};
    }
  }

  /**
   * Get message code for global notification
   * @param { Object } response
   * @returns String
   */
  getResponseMessage(response) {
    return response?.data?.message;
  }

  /**
   * Show success notify or set type and message in local storage for display with delay
   * @param { String } message
   * @param { Boolean } withDelay
   */
  showSuccessNotify(message, withDelay) {
    const type = "success";

    if (withDelay) {
      localStorage.setItem("notify", JSON.stringify({ type, message }));
    } else {
      this.#notify.success(message);
    }
  }

  /**
   * Change loaders state (on | off): redeclare this method
   * @param { String } state
   * @param { String } resource
   */
  loader(state, resource) {
    // eslint-disable-next-line no-console
    if (state === "on") console.log(state, resource);
    // eslint-disable-next-line no-console
    if (state === "off") console.log(state, resource);
  }

  /**
   * Inits axios
   */
  axiosInit() {
    const restApiPrefix = process.env.VUE_APP_REST_API_PREFIX;
    let baseUrl = process.env.VUE_APP_DOMAIN;

    const PROTOCOL_BACKSLASHES = "//";

    const [protocol] = baseUrl.split(PROTOCOL_BACKSLASHES);
    const isFullBaseUrl = protocol === "https:" || protocol === "http:";

    baseUrl = baseUrl && isFullBaseUrl ? baseUrl : document.location.origin;

    Vue.use(VueAxios, axios);

    Vue.axios.defaults.baseURL = baseUrl + restApiPrefix;

    this.setAxiosInterceptors(Vue.axios);
  }

  /**
   * Send the GET HTTP request
   * @param { String } resource
   * @param { Object } settings
   * @returns { IDBRequest<IDBValidKey> | Promise<void> }
   */
  get(resource, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;
    const config = this.getRequestConfig(settings);

    if (withLoader) {
      this.loader("on", resource);
    }

    return Vue.axios.get(resource, config).then((response) => {
      if (withNotify) {
        const message = this.getResponseMessage(response);

        this.showSuccessNotify(message, delaySuccessNotify);
      }

      return response;
    });
  }

  /**
   * Set the POST HTTP request
   * @param { String } resource
   * @param params
   * @param { Object } settings
   * @returns { IDBRequest<IDBValidKey> | Promise<void> }
   */
  post(resource, params = null, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;
    const config = this.getRequestConfig(settings);

    if (withLoader) {
      this.loader("on", resource);
    }

    return Vue.axios.post(resource, params, config).then((response) => {
      if (withNotify) {
        const message = this.getResponseMessage(response);

        this.showSuccessNotify(message, delaySuccessNotify);
      }

      return response;
    });
  }

  /**
   * Send the PUT HTTP request
   * @param { String } resource
   * @param params
   * @param { Object } settings
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params = null, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;
    const config = this.getRequestConfig(settings);

    if (withLoader) {
      this.loader("on", resource);
    }

    return Vue.axios.put(resource, params, config).then((response) => {
      if (withNotify) {
        const message = this.getResponseMessage(response);

        this.showSuccessNotify(message, delaySuccessNotify);
      }

      return response;
    });
  }

  /**
   * Send the PATCH HTTP request
   * @param { String } resource
   * @param params
   * @param { Object } settings
   * @returns { IDBRequest<IDBValidKey> | Promise<void> }
   */
  patch(resource, params = null, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;
    const config = this.getRequestConfig(settings);

    if (withLoader) {
      this.loader("on", resource);
    }

    return Vue.axios.patch(resource, params, config).then((response) => {
      if (withNotify) {
        const message = this.getResponseMessage(response);

        this.showSuccessNotify(message, delaySuccessNotify);
      }

      return response;
    });
  }

  /**
   * Send the DELETE HTTP request
   * @param { String } resource
   * @param { Object } settings
   * @returns { IDBRequest<IDBValidKey> | Promise<void> }
   */
  delete(resource, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;
    const config = this.getRequestConfig(settings);

    if (withLoader) {
      this.loader("on", resource);
    }

    return Vue.axios.delete(resource, config).then((response) => {
      if (withNotify) {
        const message = this.getResponseMessage(response);

        this.showSuccessNotify(message, delaySuccessNotify);
      }

      return response;
    });
  }
}
