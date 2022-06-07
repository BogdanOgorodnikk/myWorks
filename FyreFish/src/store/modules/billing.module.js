import AcceptjsService from "@/services/acceptjs.service";
import { addPaymentMethod } from "@/api/billing";
import i18n from "@/plugins/vue-i18n";

export default {
  namespaced: true,

  state: {
    address: {
      firstName: "John",
      lastName: "Doe",
      addressLine1: "1060 24th Rd",
      addressLine2: "",
      city: "Oakland",
      state: "Nebraska",
      country: "usa",
      zipcode: "68045",
      phone: "1231231231",
    },
    acceptjs: {
      paymentMethodId: null,
      defaultMethod: false,
      creditCard: {
        cardNumber: null,
        cardType: null,
      },
    },
    paymentMethodOptions: [
      {
        id: "amex",
        label: i18n.t("label.amex"),
        cardNumber: "**** **** **** 1157",
        cardIcon: "americanExpress.png",
      },
      {
        id: "mastercard",
        label: i18n.t("label.masterCard"),
        cardNumber: "**** **** **** 8193",
        cardIcon: "masterCard.png",
      },
      {
        id: "visa",
        label: i18n.t("label.visa"),
        cardNumber: "**** **** **** 8986",
        cardIcon: "visa.png",
      },
    ],
  },

  mutations: {
    SET_PAYMENT_DATA(state, paymentData) {
      state.acceptjs = paymentData;
    },
    DELETE_PAYMENT_METHOD(state, paymentData) {
      state.paymentMethodOptions = state.paymentMethodOptions.filter(
        (paymentMethod) => paymentMethod.id !== paymentData.id
      );
    },
  },

  actions: {
    async addPaymentMethod(context, params = {}) {
      await AcceptjsService.sendPaymentDataToAnet({
        paymentData: params.paymentData,
        makeDefault: params.makeDefault,
        type: params.type,
        callbackSuccess: (result) => {
          addPaymentMethod("12345", {
            paymentNonce: result.opaqueData.dataValue,
            defaultMethod: params.makeDefault,
          })
            .then((response) => {
              context.commit("SET_PAYMENT_DATA", response);
              if (params.callbackSuccess) params.callbackSuccess();
            })
            .catch((error) => {
              if (params.callbackError) params.callbackError(error);
            });
        },
        callbackError: (error) => {
          if (params.callbackError) params.callbackError(error);
        },
      });
    },
  },

  getters: {
    getAddress(state) {
      return state.address;
    },
  },
};
