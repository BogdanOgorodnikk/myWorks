import i18n from "@/plugins/vue-i18n";
import store from "@/store";
import { isPWA } from "@ilevel/our.service.ui";

const Business = () => import(/* webpackChunkName: "business" */ "@/views/business/index");
const AddBusiness = () => import(/* webpackChunkName: "business" */ "@/views/business/add");
const EditBusiness = () => import(/* webpackChunkName: "business" */ "@/views/business/edit");

const business = [
  {
    path: "/",
    name: "Business",
    component: Business,
    meta: {
      title: i18n.t("title.business.list"),
    },
    beforeEnter: (to, from, next) => {
      const rootRoute = "/";
      const lastActiveBusiness = localStorage.getItem("businessName");
      const isBasicPage = document.location.pathname === rootRoute;

      if (isPWA && isBasicPage && lastActiveBusiness) {
        next({ name: "MainLayout", params: { businessName: lastActiveBusiness }, replace: true });
      } else if (isBasicPage) {
        store.dispatch("business/openFirstBusiness");
      }

      next();
    },
  },
  {
    path: "/business/0",
    name: "AddBusiness",
    component: AddBusiness,
    meta: {
      title: i18n.t("title.business.add"),
    },
  },
  {
    path: "/business/:id",
    name: "EditBusiness",
    component: EditBusiness,
    meta: {
      title: i18n.t("title.business.edit"),
    },
  },
];

export default business;
