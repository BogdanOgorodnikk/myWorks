import Vue from "vue";
import Router from "vue-router";
import mainLayout from "@/router/layouts/mainLayout";
import standaloneLayout from "@/router/layouts/standaloneLayout";
import errorLayout from "@/router/layouts/errorLayout";
import authLayout from "@/router/layouts/authLayout";
import beforeEachMiddleware from "@/router/beforeEachMiddleware";
import afterEachMiddleware from "@/router/afterEachMiddleware";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.VUE_APP_BASE_PATH,
  routes: [
    ...authLayout,
    ...errorLayout,
    ...mainLayout,
    ...standaloneLayout,
    {
      path: "*",
      redirect: "/404",
    },
  ],
});

router.beforeEach(beforeEachMiddleware);
router.afterEach(afterEachMiddleware);

export default router;
