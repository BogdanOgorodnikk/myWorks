import ApiService from "@/services/api.service";
import JwtService from "@/services/jwt.service";
import KeycloakService from "@/services/keycloak.service";

const MILLISECONDS_IN_SECOND = 1000;

export default {
  state: {
    token: JwtService.getAuthToken(),
    expires: JwtService.getAuthTokenExpiresTime(),
    languages: {
      en: "Eng",
    },
    signUpData: {},
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
    SET_AUTH(state, authData) {
      const { token, refreshToken, expires } = authData;

      state.token = token;
      state.refreshToken = refreshToken;
      state.expires = expires;

      JwtService.saveAuthToken(state.token, state.expires);
      ApiService.setHeader();
    },

    PURGE_AUTH(state) {
      state.token = null;
      state.expires = null;
    },

    SET_SIGN_UP_DATA(state, signUpData) {
      state.signUpData = signUpData;
    },
  },

  actions: {
    async initAuth() {
      if (!KeycloakService.isInitialised()) {
        await KeycloakService.init();
      }
    },

    async verifyAuth(context) {
      const { isAuthenticatedUser, tokenValidityTime } = context.getters;
      const now = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);

      if (isAuthenticatedUser) {
        ApiService.setHeader();

        if (now > tokenValidityTime) {
          await KeycloakService.updateToken();
        }
      } else {
        await context.dispatch("clearAuth");
      }
    },

    async clearAuth(context) {
      context.commit("PURGE_AUTH");

      JwtService.destroyAuthToken();
    },

    async logout(context) {
      await context.dispatch("clearAuth");

      await KeycloakService.logout();
    },
  },
};
