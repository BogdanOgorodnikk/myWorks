import router from "@/router";
import i18n from "@/plugins/vue-i18n";
import {
  getIntegration,
  getIntegrations,
  addIntegration,
  updateIntegration,
  deleteIntegration,
} from "@/api/accountIntegration";

export default {
  namespaced: true,
  state: {
    accountIntegration: null,
    accountIntegrations: [],
    integrationBanks: [
      { label: i18n.t(`label.privatBankBusiness`), code: "privatBankBiz" },
      { label: i18n.t(`label.privatBank`), code: "privatBankPersonal" },
      { label: i18n.t(`label.monoBank`), code: "monoBankPersonal" },
    ],
  },

  mutations: {
    SET_INTEGRATION(state, integration = null) {
      state.accountIntegration = integration;
    },

    SET_INTEGRATIONS(state, integrations) {
      state.accountIntegrations = integrations;
    },

    DELETE_INTEGRATION(state, integrationId) {
      state.accountIntegrations = state.accountIntegrations.filter(
        (integration) => integration.id !== integrationId
      );
    },
  },

  actions: {
    async getIntegration(context, integrationId) {
      if (!integrationId) return;

      const response = await getIntegration(integrationId);

      context.commit("SET_INTEGRATION", response);
    },

    async getIntegrations(context) {
      const response = await getIntegrations();

      context.commit("SET_INTEGRATIONS", response);
    },

    async addIntegration(context, integration) {
      await addIntegration(integration);
    },

    async updateIntegration(context, integration) {
      await updateIntegration(integration);
    },

    async deleteIntegration(context, { integrationId, currentRoute }) {
      await deleteIntegration(integrationId);
      context.commit("DELETE_INTEGRATION", integrationId);

      if (currentRoute !== "AccountList") {
        router.push({ name: "AccountList" });
      }
    },
  },
};
