import i18n from "@/plugins/vue-i18n";
import router from "@/router";
import { getSettings, updateSettings } from "@/api/settings";
import idb from "@/plugins/vue-idb-keyval";

export default {
  namespaced: true,
  state: {
    settings: null,
  },

  getters: {
    baseCurrency(state) {
      return state.settings.currency;
    },

    countries(state) {
      const countryValues = state.settings?.country?.values;

      const statusLocalCode = {
        ru: "country.ru",
        ua: "country.ua",
      };

      let countryOptions = [];

      if (countryValues) {
        countryOptions = countryValues.map((country) => ({
          code: country,
          label: `${i18n.t(statusLocalCode[country])}`,
        }));
      }

      return countryOptions;
    },

    isShownCents(state) {
      return state.settings.showCents.current;
    },

    isMakeConfirmedByDefault(state) {
      return state.settings.makeConfirmed.current;
    },

    brandName(state, getters, rootState) {
      const currentBusinessSlug = router.history.current.params?.businessName;
      const currentBusiness = rootState.business.businesses?.find(
        (business) => business.slug === currentBusinessSlug || ""
      );

      return currentBusiness?.name || "";
    },
  },

  mutations: {
    SET_SETTINGS(state, settings) {
      state.settings = settings;
    },
  },

  actions: {
    async getSettings(context) {
      if (context.state.settings) return;

      const idbGeneralSettings = await idb.get("generalSettings");
      const isPresentIdbData = !!idbGeneralSettings?.length;

      if (isPresentIdbData) {
        context.commit("SET_SETTINGS", idbGeneralSettings);
      }

      const response = await getSettings();

      context.commit("SET_SETTINGS", response);

      await idb.set("generalSettings", response);

      await context.dispatch("business/getBusinesses", null, { root: true });
    },

    async updateSettings(context, params) {
      const response = await updateSettings(params);

      const settings = {
        companyName: {
          current: response.companyName,
        },
        country: {
          current: response.country,
        },
        currency: {
          current: response.currency,
          currentSymbol: response.currentSymbol,
        },
        language: {
          current: response.language,
        },
        timezone: {
          current: response.timezone,
        },
        showCents: {
          current: response.showCents,
        },
        makeConfirmed: {
          current: response.makeConfirmed,
        },
      };

      context.commit("SET_SETTINGS", settings);

      await idb.set("generalSettings", settings);
    },
  },
};
