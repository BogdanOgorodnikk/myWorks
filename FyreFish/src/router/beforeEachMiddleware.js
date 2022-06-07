import store from "@/store";
import storage from "@/services/_bit/StorageService";
import notify from "@/services/notify.service";
import ApiService from "@/services/api.service";

function setDelayNotify() {
  const notifyData = storage.getObj("notify");

  notify.clearAll();

  if (notifyData) {
    const { type, message } = notifyData;

    notify[type](message);

    storage.removeObj("notify");
  }
}

export default async (to, from, next) => {
  const publicPages = [
    "SignUpBuildings",
    "SignUpProducts",
    "SignUpUserInformation",
    "SignUpPayment",
    "SignUpSuccess",
    "ContactUs",
  ];
  const isPublicPage = publicPages.includes(to.name);
  const { isAuthenticatedUser } = store.getters;
  const isWideContent = store.state.layout.wideContent;

  ApiService.setHeader();

  setDelayNotify();

  if (isWideContent) {
    store.state.layout.wideContent = false;
  }

  if (isPublicPage) {
    if (isAuthenticatedUser) {
      await store.dispatch("getUserType");

      next({ name: "MainLayout" });
    } else {
      next();
    }
  } else {
    await store.dispatch("initAuth");
    await store.dispatch("verifyAuth");
    await store.dispatch("getUserType");

    next();
  }
};
