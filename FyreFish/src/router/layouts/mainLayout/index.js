import store from "@/store";

import profile from "./profile";
import home from "./home";
import billing from "./billing";
import account from "./account";
import shop from "./shop";
import service from "./service";
import setting from "./setting";
import support from "./support";
import properties from "./properties";

const MainLayout = () => import(/* webpackChunkName: "mainLayout" */ "@/layouts/main");

const mainLayout = [
  {
    path: "/",
    name: "MainLayout",
    redirect: () => {
      if (store.getters.isPropertyManager) {
        return "Properties";
      } else {
        return "Home";
      }
    },
    component: MainLayout,
    children: [
      ...profile,
      ...home,
      ...billing,
      ...account,
      ...shop,
      ...service,
      ...setting,
      ...support,
      ...properties,
    ],
  },
];

export default mainLayout;
