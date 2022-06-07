import idb from "@/plugins/vue-idb-keyval";
import ApiService from "@/services/api.service";
import JwtService from "@/services/jwt.service";
import { addHours, getUnixTime } from "date-fns";
import router from "@/router";
import {
  login,
  loginToApp,
  signUp,
  refreshAuth,
  resetPassword,
  changeUserPassword,
  logout,
} from "@/api/auth";

const MILLISECONDS_IN_SECOND = 1000;

export default {
  state: {
    token: JwtService.getAuthToken(),
    expires: JwtService.getAuthTokenExpiresTime(),
  },

  getters: {
    isAuthenticatedUser(state) {
      return !!state.token;
    },

    tokenValidityTime(state) {
      return Number(state.expires);
    },
  },

  mutations: {
    SET_AUTH(state, { token, expires }) {
      state.token = token;

      if (!expires) {
        const now = Date.now();
        const newDate = addHours(now, 1);

        state.expires = getUnixTime(newDate);
      } else {
        state.expires = expires;
      }

      JwtService.saveAuthToken(state.token, state.expires);
      ApiService.setHeader();
    },

    PURGE_AUTH(state) {
      state.token = null;
      state.expires = null;
    },
  },

  actions: {
    async login(context, userData) {
      const response = await login(userData);

      context.commit("SET_AUTH", response);
    },

    async loginToApp(context, businessId) {
      const response = await loginToApp(businessId);

      const businesses = context.rootState.business.businesses;
      const authorisedBusiness = businesses.find((item) => item.id === businessId);

      localStorage.setItem("businessName", authorisedBusiness.slug);

      context.commit("SET_AUTH", response);
    },

    async signUp(context, userData) {
      await signUp(userData);

      router.push({ name: "Login" });
    },

    async refreshAuth(context) {
      const response = await refreshAuth();

      context.commit("SET_AUTH", response);
    },

    async resetPassword(context, userData) {
      return await resetPassword(userData);
    },

    async changeUserPassword(context, userData) {
      const response = await changeUserPassword(userData);

      context.commit("SET_AUTH", response);
    },

    async verifyAuth(context) {
      const { isAuthenticatedUser, tokenValidityTime } = context.getters;
      const now = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);

      if (isAuthenticatedUser) {
        ApiService.setHeader();

        if (now > tokenValidityTime) {
          await context.dispatch("refreshAuth");
        }
      } else {
        await context.dispatch("clearAuth");
      }
    },

    clearAuth(context) {
      context.commit("PURGE_AUTH");

      JwtService.destroyAuthToken();

      window.location = "/login";
    },

    async logout(context) {
      await logout();

      idb.clear();

      context.dispatch("clearAuth");
    },
  },
};
