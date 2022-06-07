import i18n from "@/plugins/vue-i18n";

const Shop = () => import(/* webpackChunkName: "shop" */ "@/views/shop");

const shop = [
  {
    path: "shop",
    name: "Shop",
    component: Shop,
    meta: {
      title: i18n.t("title.shop"),
    },
  },
];

export default shop;
