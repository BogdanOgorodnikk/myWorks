import i18n from "@/plugins/vue-i18n";
import router from "@/router";
import {
  createBusiness,
  getBusiness,
  getBusinesses,
  updateBusiness,
  deleteBusiness,
} from "@/api/business";
import idb from "@/plugins/vue-idb-keyval";
import DataService from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    businesses: [],
    business: null,
    businessName: null,
  },

  getters: {
    brandNameDropdownItems(state) {
      return state.businesses.map((item) => ({
        id: item.id,
        title: item.name,
        businessName: item.slug,
      }));
    },
  },

  mutations: {
    SET_BUSINESSES(state, businesses) {
      if (!businesses.length && typeof businesses !== "object") {
        return;
      }

      if (businesses.length) {
        businesses.forEach((business) => {
          if (!business.name) {
            business.name = i18n.t("page.business.companyNotSpecified");
          }
        });

        state.businesses = businesses;
      } else if (typeof businesses === "object") {
        if (!businesses.name) {
          businesses.name = i18n.t("page.business.companyNotSpecified");
        }

        state.businesses.push(businesses);
      }
    },

    UPDATE_BUSINESS(state, business) {
      state.businesses = DataService.updateArray(state.businesses, [business]);
    },

    SET_BUSINESS(state, business = null) {
      state.business = business;
    },

    SET_BUSINESSNAME(state, businessName) {
      state.businessName = businessName;
    },

    DELETE_BUSINESS(state, businessId) {
      state.businesses = state.businesses.filter((business) => business.id !== businessId);
    },
  },

  actions: {
    async brandNameDropdownItemClick(context, { businessId, businessName }) {
      await context.dispatch("loginToApp", businessId, { root: true });

      await router.push({ name: "MainLayout", params: { businessName } });

      window.location.reload();
    },

    async getBusinesses(context) {
      if (context.state.businesses.length) return;

      const idbBusinesses = await idb.get("businesses");
      const isPresentIdbData = !!idbBusinesses?.length;

      if (isPresentIdbData) {
        context.commit("SET_BUSINESSES", idbBusinesses);
      }

      const response = await getBusinesses(isPresentIdbData);

      context.commit("SET_BUSINESSES", response);

      await idb.set("businesses", response);
    },

    async getBusiness(context, businessId) {
      if (!businessId) return;

      const response = await getBusiness(businessId);

      context.commit("SET_BUSINESS", response);
    },

    async createBusiness(context, business) {
      const response = await createBusiness(business);

      context.commit("SET_BUSINESSES", response);

      await idb.set("businesses", context.state.businesses);
    },

    async openFirstBusiness(context) {
      const businesses = await getBusinesses();
      const [firstBusiness] = businesses;

      if (firstBusiness) {
        await context.dispatch("loginToApp", firstBusiness.id, { root: true });

        await router.push({ name: "MainLayout", params: { businessName: firstBusiness.slug } });
      }
    },

    async updateBusiness(context, { businessData, withNotify = true }) {
      const response = await updateBusiness(businessData, withNotify);

      context.commit("UPDATE_BUSINESS", response);

      await idb.set("businesses", context.state.businesses);
    },

    async deleteBusiness(context, businessId) {
      await deleteBusiness(businessId);

      context.commit("DELETE_BUSINESS", businessId);

      await idb.set("businesses", context.state.businesses);
    },
  },
};
