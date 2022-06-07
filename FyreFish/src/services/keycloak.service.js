import Keycloak from "keycloak-js";
import store from "@/store";
import NotifyService from "@ilevel/our.service.notify";

class KeycloakService {
  #notify = new NotifyService();

  async init() {
    this._keycloak = new Keycloak({
      url: process.env.VUE_APP_KEYCLOAK_URL,
      realm: process.env.VUE_APP_KEYCLOAK_REALM,
      clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
    });

    await this._keycloak
      .init({ onLoad: "login-required" })
      .then((authenticated) => {
        if (!authenticated) {
          window.location.reload();
        }

        this.#notify.clearAll();

        store.commit("SET_AUTH", {
          token: this._keycloak.token,
          refreshToken: this._keycloak.token,
          expires: this._keycloak.tokenParsed.exp,
        });
      })
      .catch(() => {
        this.#notify.error("authenticationInitializationFailure");
      });

    this._keycloak.onTokenExpired = async () => {
      await this.updateToken();
    };
  }

  async updateToken() {
    await this._keycloak
      .updateToken(30)
      .then((refreshed) => {
        if (refreshed) {
          this.#notify.clearAll();

          store.commit("SET_AUTH", {
            token: this._keycloak.token,
            refreshToken: this._keycloak.token,
            expires: this._keycloak.tokenParsed.exp,
          });
        }
      })
      .catch(() => {
        this.#notify.error("failedToRefreshTheToken");
      });
  }

  async logout() {
    await this._keycloak.logout();
  }

  isInitialised() {
    return !!this._keycloak;
  }
}

export default new KeycloakService();
