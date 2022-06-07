import NotifyService from "@/services/notify.service";
import store from "@/store";

function setDelayNotify() {
  const notifyData = JSON.parse(localStorage.getItem("notify"));

  NotifyService.clearAll();

  if (notifyData) {
    const { type, message } = notifyData;

    NotifyService[type](message);

    localStorage.removeItem("notify");
  }
}

export default async (to, from, next) => {
  const authPages = ["Login", "SignUp", "ForgotPassword"];
  const isAuthPage = authPages.includes(to.name);
  const { isAuthenticatedUser } = store.getters;
  const { userProfile } = store.state.user;

  setDelayNotify();

  if (isAuthPage) {
    isAuthenticatedUser ? next({ name: "BusinessLayout" }) : next();
  } else {
    await store.dispatch("verifyAuth");

    if (isAuthenticatedUser && !userProfile) {
      await store.dispatch("user/getUserProfile");
    }

    next();
  }
};
