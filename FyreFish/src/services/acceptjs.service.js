import notify from "@ilevel/our.service.notify";

/**
 * Service
 */
const AcceptjsService = {
  defaultPayment: false,
  callbackSuccess: null,
  callbackError: null,

  init() {
    if (typeof Accept === "undefined") {
      // eslint-disable-line no-undef
      const plugin = document.createElement("script");

      plugin.setAttribute("src", "https://jstest.authorize.net/v1/Accept.js");
      plugin.async = true;
      document.head.appendChild(plugin);
    }
  },

  sendPaymentDataToAnet(params) {
    this.defaultPayment = params.defaultPayment || false;
    this.callbackSuccess = params.callbackSuccess || null;
    this.callbackError = params.callbackError || null;
    let type = params.type || "card";
    let authData = {};

    authData.clientKey = process.env.VUE_APP_ACCEPTJS_CLIENT_KEY;
    authData.apiLoginID = process.env.VUE_APP_ACCEPTJS_API_LOGIN_ID;

    let secureData = {};

    secureData.authData = authData;

    if (type === "card") {
      secureData.cardData = params.paymentData;
    } else {
      secureData.bankData = params.paymentData;
    }

    Accept.dispatchData(secureData, this.responseHandler.bind(this)); // eslint-disable-line no-undef
  },

  responseHandler(response) {
    if (response.messages.resultCode === "Error") {
      let returnArray = [];
      let i = 0;

      while (i < response.messages.message.length) {
        returnArray.push({
          code: response.messages.message[i].code,
          text: response.messages.message[i].text,
        });
        notify.error(response.messages.message[i].code);
        i++;
      }

      if (this.callbackError) {
        this.callbackError(returnArray);
      }
    } else {
      if (this.callbackSuccess) {
        this.callbackSuccess(response);
      }
    }
  },
};

export default AcceptjsService;
